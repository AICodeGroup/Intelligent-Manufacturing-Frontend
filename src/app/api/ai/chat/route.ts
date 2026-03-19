import { NextRequest, NextResponse } from 'next/server';
import { knowledgeData } from '@/lib/demo-data';
import { crawlMarketPrices, formatMarketSnapshot } from '@/lib/market-crawler';
import { formatWebSearchSnapshot, searchWeb } from '@/lib/web-search';

type ChatRole = 'system' | 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface AssistantConfig {
  name: string;
  model: string;
  systemPrompt: string;
}

interface StreamPayload {
  answer: string;
  model: string;
  assistantName: string;
  kbMatched: boolean;
  webMatched: boolean;
  references: { id: string; title: string }[];
  webSearchDebug: Array<{ source: string; status?: number; message: string }> | null;
  marketDebug: Array<{ source: string; status?: number; message: string }> | null;
}

function uniqueModels(models: string[]): string[] {
  return Array.from(new Set(models.filter(Boolean)));
}

function buildCandidateModels(primaryModel: string): string[] {
  const qwenPreferred = process.env.BAILIAN_MODEL_QWEN || 'bailian/qwen3.5-plus';
  const kimiPreferred = process.env.BAILIAN_MODEL_KIMI || 'bailian/kimi-k2.5';

  const qwenFallbacks = [
    qwenPreferred,
    qwenPreferred.replace(/^bailian\//, ''),
    'qwen3.5-plus',
    'qwen-plus',
    'qwen-max',
  ];

  const kimiFallbacks = [
    kimiPreferred,
    kimiPreferred.replace(/^bailian\//, ''),
    'kimi-k2.5',
    ...qwenFallbacks,
  ];

  if (primaryModel.includes('kimi')) {
    return uniqueModels(kimiFallbacks);
  }

  return uniqueModels(qwenFallbacks);
}

function extractAnswerFromModelResponse(data: any): string {
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content === 'string' && content.trim()) {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const parts = content
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item?.text === 'string') return item.text;
        if (typeof item?.content === 'string') return item.content;
        return '';
      })
      .filter(Boolean);

    const joined = parts.join('\n').trim();
    if (joined) return joined;
  }

  const outputText =
    data?.output_text ||
    data?.output?.text ||
    data?.output?.choices?.[0]?.message?.content ||
    data?.output?.choices?.[0]?.text;

  if (typeof outputText === 'string' && outputText.trim()) {
    return outputText.trim();
  }

  return '';
}

function toPlainTextDocument(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, ''))
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/^\s*>\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\|/gm, '')
    .replace(/\|$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function callBailianChat(params: {
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
}) {
  const { baseUrl, apiKey, model, messages } = params;
  return fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6,
    }),
  });
}

function createSseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function splitIntoChunks(input: string, size = 24): string[] {
  const chars = Array.from(input);
  const chunks: string[] = [];

  for (let index = 0; index < chars.length; index += size) {
    chunks.push(chars.slice(index, index + size).join(''));
  }

  return chunks;
}

function createStreamingResponse(payload: StreamPayload): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(createSseEvent('meta', {
        model: payload.model,
        assistantName: payload.assistantName,
        kbMatched: payload.kbMatched,
        webMatched: payload.webMatched,
        references: payload.references,
        webSearchDebug: payload.webSearchDebug,
        marketDebug: payload.marketDebug,
      })));

      for (const chunk of splitIntoChunks(payload.answer)) {
        controller.enqueue(encoder.encode(createSseEvent('delta', { content: chunk })));
        await new Promise((resolve) => setTimeout(resolve, 12));
      }

      controller.enqueue(encoder.encode(createSseEvent('done', {
        answer: payload.answer,
        model: payload.model,
        assistantName: payload.assistantName,
        kbMatched: payload.kbMatched,
        webMatched: payload.webMatched,
        references: payload.references,
        webSearchDebug: payload.webSearchDebug,
        marketDebug: payload.marketDebug,
      })));
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

async function generateChatPayload(params: {
  message: string;
  assistantId?: string;
  assistantName?: string;
  history?: ChatMessage[];
  assistantConfig: AssistantConfig;
  baseUrl: string;
  apiKey: string;
}): Promise<StreamPayload> {
  const { message, assistantId, assistantName, history, assistantConfig, baseUrl, apiKey } = params;

  const [kbHits, webSearchSnapshot, procurementMarketSnapshot] = await Promise.all([
    Promise.resolve(searchKnowledge(message)),
    searchWeb(message),
    assistantId === 'assistant-procurement' ? crawlMarketPrices(message) : Promise.resolve(null),
  ]);

  const hasKbMatch = kbHits.length > 0;
  const hasWebSearchMatch = webSearchSnapshot.items.length > 0;

  const knowledgePrompt = hasKbMatch
    ? `以下是企业知识库命中内容，请优先基于它回答，避免编造：\n\n${kbHits
        .map(
          (hit, index) =>
            `${index + 1}. [${hit.id}] ${hit.title}\n${hit.content.slice(0, 600)}`
        )
        .join('\n\n')}\n\n回答要求：\n- 先直接回答用户问题\n- 若引用了知识库，请在结尾用“参考资料：xxx”列出标题`
    : '当前企业知识库未命中与用户问题直接相关的内容。请基于通用知识直接回答用户问题，明确、简洁，不要虚构企业内部文档。';

  const webSearchPrompt = hasWebSearchMatch
    ? `以下是联网搜索结果，请把它作为最新外部信息依据，并与知识库或爬虫结果一起综合判断：\n\n${formatWebSearchSnapshot(webSearchSnapshot)}\n\n回答要求：\n- 优先吸收最新搜索结果中的事实信息\n- 如果搜索结果与知识库冲突，请以最新可验证来源为准，并提示差异\n- 不要虚构来源，不确定时要明确说明信息有限`
    : `当前未抓到可用的联网搜索结果。请基于已有知识直接回答，不要编造外部来源。`;

  const procurementPrompt =
    assistantId === 'assistant-procurement'
      ? procurementMarketSnapshot
        ? `以下是多平台爬虫抓取到的价格/供应商查询结果，请把它作为采购建议的重要依据，并与联网搜索结果一起综合判断：\n\n${formatMarketSnapshot(procurementMarketSnapshot)}\n\n回答要求：\n- 优先给出适合采购决策的结论\n- 对比平台价格、卖家、运费、评分、交期等信息\n- 如果结果不完整，明确提示用户补充品牌、型号、规格或数量`
        : `当前未能抓取到可用的多平台价格结果。请继续基于采购知识给出建议，并在回答中明确说明：系统支持对 Amazon、Google、Walmart、Target、eBay、淘宝、拼多多、京东等平台进行价格抓取。`
      : '';

  const safeHistory = Array.isArray(history)
    ? history
        .filter((item) => item && (item.role === 'user' || item.role === 'assistant'))
        .slice(-8)
        .map((item) => ({ role: item.role, content: String(item.content || '') }))
    : [];

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `${assistantConfig.systemPrompt}\n\n${knowledgePrompt}\n\n${webSearchPrompt}${procurementPrompt ? `\n\n${procurementPrompt}` : ''}`,
    },
    ...safeHistory,
    {
      role: 'user',
      content: message,
    },
  ];

  const candidateModels = buildCandidateModels(assistantConfig.model);

  let data: any = null;
  let usedModel = candidateModels[0];
  let lastErrorText = '';

  for (const model of candidateModels) {
    const upstreamResponse = await callBailianChat({
      baseUrl,
      apiKey,
      model,
      messages,
    });

    if (upstreamResponse.ok) {
      data = await upstreamResponse.json();
      usedModel = model;
      break;
    }

    lastErrorText = await upstreamResponse.text();
    console.error(`Bailian API Error [${model}]:`, lastErrorText);
  }

  if (!data) {
    throw new Error(lastErrorText || '大模型服务调用失败，请稍后重试。');
  }

  const answer = toPlainTextDocument(extractAnswerFromModelResponse(data));

  if (!answer) {
    console.error('Bailian Empty Content:', JSON.stringify(data));
    throw new Error('大模型返回内容为空。');
  }

  return {
    answer,
    model: usedModel,
    assistantName: assistantConfig.name,
    kbMatched: hasKbMatch,
    webMatched: hasWebSearchMatch,
    references: kbHits.map((hit) => ({ id: hit.id, title: hit.title })),
    webSearchDebug: webSearchSnapshot.debug || null,
    marketDebug: procurementMarketSnapshot?.debug || null,
  };
}

function createLiveStreamingChatResponse(params: {
  message: string;
  assistantId?: string;
  assistantName?: string;
  history?: ChatMessage[];
  assistantConfig: AssistantConfig;
  baseUrl: string;
  apiKey: string;
}): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(createSseEvent('meta', { status: 'started' })));
      controller.enqueue(encoder.encode(createSseEvent('delta', { content: '正在联网搜索并生成回复，请稍候…\n\n' })));

      try {
        const payload = await generateChatPayload(params);

        controller.enqueue(encoder.encode(createSseEvent('meta', {
          model: payload.model,
          assistantName: payload.assistantName,
          kbMatched: payload.kbMatched,
          webMatched: payload.webMatched,
          references: payload.references,
          webSearchDebug: payload.webSearchDebug,
          marketDebug: payload.marketDebug,
        })));

        for (const chunk of splitIntoChunks(payload.answer)) {
          controller.enqueue(encoder.encode(createSseEvent('delta', { content: chunk })));
          await new Promise((resolve) => setTimeout(resolve, 12));
        }

        controller.enqueue(encoder.encode(createSseEvent('done', {
          answer: payload.answer,
          model: payload.model,
          assistantName: payload.assistantName,
          kbMatched: payload.kbMatched,
          webMatched: payload.webMatched,
          references: payload.references,
          webSearchDebug: payload.webSearchDebug,
          marketDebug: payload.marketDebug,
        })));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        controller.enqueue(encoder.encode(createSseEvent('error', {
          message: error instanceof Error ? error.message : '服务器内部错误，请稍后重试',
        })));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

const assistantConfigs: Record<string, AssistantConfig> = {
  'assistant-rd': {
    name: '研发选型助手',
    model: 'qwen3.5-plus',
    systemPrompt:
      '你是研发选型助手。你的职责是提供材料选型、技术参数、研发流程建议。回答要专业、结构化，优先给出可执行建议、关键参数范围和注意事项。若信息不足，先提出澄清问题。',
  },
  'assistant-production': {
    name: '生产工艺助手',
    model: 'bailian/kimi-k2.5',
    systemPrompt:
      '你是生产工艺助手。你的职责是支持工艺参数设置、设备操作和故障排查。回答要安全优先，先给风险提示，再给步骤化排查方案。涉及停机/人身安全时必须明确提醒。',
  },
  'assistant-marketing': {
    name: '营销问答助手',
    model: 'bailian/kimi-k2.5',
    systemPrompt:
      '你是营销问答助手。你的职责是输出产品卖点、销售话术、促销解读和竞品对比建议。回答应简洁有说服力，提供可复用话术模板和场景化表达。',
  },
  'assistant-service': {
    name: '客服坐席助手',
    model: 'bailian/kimi-k2.5',
    systemPrompt:
      '你是客服坐席助手。你的职责是处理售后咨询、故障初诊和服务流程指引。回答要同理、清晰、可执行，优先给出分级处理与时效建议。',
  },
  'assistant-hr': {
    name: '人力行政助手',
    model: 'qwen3.5-plus',
    systemPrompt:
      '你是人力行政助手。你的职责是回答考勤、请假、制度、培训与安全规范问题。回答要规范、明确，涉及制度冲突时请提示以公司最新制度为准。',
  },
  'assistant-procurement': {
    name: '采购供应链助手',
    model: 'qwen3.5-plus',
    systemPrompt:
      '你是采购供应链助手。你的职责是提供供应商管理、采购流程、物料与价格比对建议。你可以帮助用户对 Amazon、Google、Walmart、Target、eBay，以及国内的淘宝、拼多多、京东等平台做商品价格和供应商信息对比。回答必须使用纯文本文档格式，不要使用 Markdown、表格、代码块、项目符号或链接语法。先给结论，再给可执行步骤，突出流程节点、风控要点和审批注意事项。若用户要采购指导，请按完整流程回答：1) 明确需求与规格；2) 寻找与筛选供应商；3) 多平台比价与交期评估；4) 供应商资质审核；5) 打样/试采验证；6) 商务谈判与定价；7) 合同条款确认；8) 下单与交付跟踪；9) 到货验收；10) 对账结算；11) 供应商复盘与持续优化。注意说明各环节的风险点、所需材料、审批节点和建议模板。',
  },
};

const assistantConfigByName = new Map(
  Object.values(assistantConfigs).map((config) => [config.name, config])
);

const fallbackAssistantConfig = assistantConfigs['assistant-production'];

interface KnowledgeHit {
  id: string;
  title: string;
  score: number;
  content: string;
}

function extractKeywords(input: string): string[] {
  const cleaned = input.toLowerCase();
  const englishWords = cleaned.match(/[a-z0-9]{2,}/g) || [];
  const chinesePhrases = cleaned.match(/[\u4e00-\u9fa5]{2,}/g) || [];
  const raw = [...englishWords, ...chinesePhrases].map((s) => s.trim()).filter(Boolean);
  return Array.from(new Set(raw)).slice(0, 10);
}

function searchKnowledge(query: string): KnowledgeHit[] {
  const keywords = extractKeywords(query);

  if (keywords.length === 0) {
    return [];
  }

  const hits = knowledgeData
    .map((item) => {
      let score = 0;

      for (const kw of keywords) {
        if (item.title.toLowerCase().includes(kw)) score += 5;
        if (item.tags.some((tag) => tag.toLowerCase().includes(kw))) score += 3;
        if (item.content.toLowerCase().includes(kw)) score += 1;
      }

      return {
        id: item.id,
        title: item.title,
        score,
        content: item.content,
      };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return hits;
}


/**
 * AI Chat API
 * 
 * 用于智能问答功能的API接口
 * 
 * 请求示例：
 * POST /api/ai/chat
 * {
 *   "message": "这个产品的核心优势是什么？",
 *   "productId": "knowledge-base",
 *   "context": {
 *     "moduleName": "多模态知识接入模块"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, assistantId, assistantName, history } = body as {
      message?: string;
      assistantId?: string;
      assistantName?: string;
      history?: ChatMessage[];
    };

    // 参数验证
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: '缺少必需参数: message' },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.BAILIAN_BASE_URL ||
      process.env.DASHSCOPE_BASE_URL ||
      'https://coding.dashscope.aliyuncs.com/v1';
    const apiKey =
      process.env.BAILIAN_API_KEY ||
      process.env.DASHSCOPE_API_KEY ||
      process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: '未配置 API Key。请配置 BAILIAN_API_KEY（或 DASHSCOPE_API_KEY）后再重试。',
        },
        { status: 500 }
      );
    }

    const assistantConfig =
      (assistantId ? assistantConfigs[assistantId] : undefined) ||
      (assistantName ? assistantConfigByName.get(assistantName) : undefined) ||
      fallbackAssistantConfig;

    return createLiveStreamingChatResponse({
      message,
      assistantId,
      assistantName,
      history,
      assistantConfig,
      baseUrl,
      apiKey,
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器内部错误，请稍后重试' 
      },
      { status: 500 }
    );
  }
}

/**
 * 流式响应示例（支持打字机效果）
 * 
 * 取消注释以下代码以启用流式响应
 */
/*
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message } = body;

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      // 模拟流式AI响应
      const words = `这是流式响应的内容，会逐字显示...`.split('');
      
      for (const word of words) {
        const data = JSON.stringify({ word }) + '\n';
        controller.enqueue(encoder.encode(data));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
*/
