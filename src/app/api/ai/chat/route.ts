import { NextRequest, NextResponse } from 'next/server';
import { knowledgeData } from '@/lib/demo-data';

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

const assistantConfigs: Record<string, AssistantConfig> = {
  'assistant-rd': {
    name: '研发选型助手',
    model: 'bailian/qwen3.5-plus',
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
    model: 'bailian/qwen3.5-plus',
    systemPrompt:
      '你是人力行政助手。你的职责是回答考勤、请假、制度、培训与安全规范问题。回答要规范、明确，涉及制度冲突时请提示以公司最新制度为准。',
  },
  'assistant-procurement': {
    name: '采购供应链助手',
    model: 'bailian/qwen3.5-plus',
    systemPrompt:
      '你是采购供应链助手。你的职责是提供供应商管理、采购流程、物料与价格比对建议。回答要突出流程节点、风控要点和审批注意事项。',
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

    const baseUrl = process.env.BAILIAN_BASE_URL || 'https://coding.dashscope.aliyuncs.com/v1';
    const apiKey = process.env.BAILIAN_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: '未配置 BAILIAN_API_KEY，请先在 .env.local 中配置。',
        },
        { status: 500 }
      );
    }

    const assistantConfig =
      (assistantId ? assistantConfigs[assistantId] : undefined) ||
      (assistantName ? assistantConfigByName.get(assistantName) : undefined) ||
      fallbackAssistantConfig;

    const kbHits = searchKnowledge(message);
    const hasKbMatch = kbHits.length > 0;

    const knowledgePrompt = hasKbMatch
      ? `以下是企业知识库命中内容，请优先基于它回答，避免编造：\n\n${kbHits
          .map(
            (hit, index) =>
              `${index + 1}. [${hit.id}] ${hit.title}\n${hit.content.slice(0, 600)}`
          )
          .join('\n\n')}\n\n回答要求：\n- 先直接回答用户问题\n- 若引用了知识库，请在结尾用“参考资料：xxx”列出标题`
      : '当前企业知识库未命中与用户问题直接相关的内容。请基于通用知识直接回答用户问题，明确、简洁，不要虚构企业内部文档。';

    const safeHistory = Array.isArray(history)
      ? history
          .filter((item) => item && (item.role === 'user' || item.role === 'assistant'))
          .slice(-8)
          .map((item) => ({ role: item.role, content: String(item.content || '') }))
      : [];

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `${assistantConfig.systemPrompt}\n\n${knowledgePrompt}`,
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
      return NextResponse.json(
        {
          success: false,
          error: '大模型服务调用失败，请稍后重试。',
          detail: lastErrorText || undefined,
        },
        { status: 502 }
      );
    }

    const answer = extractAnswerFromModelResponse(data);

    if (!answer) {
      console.error('Bailian Empty Content:', JSON.stringify(data));
      return NextResponse.json(
        {
          success: false,
          error: '大模型返回内容为空。',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        answer,
        model: usedModel,
        assistantName: assistantConfig.name,
        kbMatched: hasKbMatch,
        references: kbHits.map((hit) => ({ id: hit.id, title: hit.title })),
      },
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
