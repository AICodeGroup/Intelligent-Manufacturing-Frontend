import { NextRequest, NextResponse } from 'next/server';
import { knowledgeData, type KnowledgeItem } from '@/lib/demo-data';
import { crawlMarketPrices, formatMarketSnapshot } from '@/lib/market-crawler';
import { formatWebSearchSnapshot, searchWeb } from '@/lib/web-search';

type ChatRole = 'system' | 'user' | 'assistant';
type TracePhase = 'intent' | 'routing' | 'knowledge' | 'case' | 'web' | 'analysis';
type ResponseRoute = 'direct' | 'knowledge';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface AssistantConfig {
  name: string;
  model: string;
  systemPrompt: string;
}

interface ReferenceItem {
  id: string;
  title: string;
  repository: string;
  department: string;
  source: string;
  updateTime: string;
  snippet: string;
}

interface RetrievalStep {
  id: string;
  title: string;
  detail: string;
  phase: TracePhase;
  files?: ReferenceItem[];
}

interface KnowledgeHit extends KnowledgeItem {
  score: number;
  repository: string;
}

interface RetrievalContext {
  kbHits: KnowledgeHit[];
  references: ReferenceItem[];
  retrievalTrace: RetrievalStep[];
  webSearchSnapshot: Awaited<ReturnType<typeof searchWeb>>;
  procurementMarketSnapshot: Awaited<ReturnType<typeof crawlMarketPrices>> | null;
}

interface StreamPayload {
  answer: string;
  model: string;
  assistantName: string;
  responseRoute: ResponseRoute;
  answerMode: 'model' | 'fallback';
  kbMatched: boolean;
  webMatched: boolean;
  references: ReferenceItem[];
  retrievalTrace: RetrievalStep[];
  webSearchDebug: Array<{ source: string; status?: number; message: string }> | null;
  marketDebug: Array<{ source: string; status?: number; message: string }> | null;
}

const assistantConfigs: Record<string, AssistantConfig> = {
  'assistant-rd': {
    name: '研发选型助手',
    model: 'qwen3.5-plus',
    systemPrompt:
      '你是研发选型助手。你的职责是提供材料选型、技术参数、设计规范匹配和历史案例复盘建议。你的回答必须体现企业内部知识差异，优先给结论，再展开技术判断、依据文档、风险点、可落地动作和待补充参数，避免百科式泛化表述。默认写得充分，不能只给一句话结论。',
  },
  'assistant-production': {
    name: '生产工艺助手',
    model: 'bailian/kimi-k2.5',
    systemPrompt:
      '你是生产工艺助手。你的职责是支持工艺参数设置、设备操作和故障排查。回答要安全优先，先给风险提示，再给步骤化排查方案。涉及停机或人身安全时必须明确提醒。',
  },
  'assistant-marketing': {
    name: '营销问答助手',
    model: 'bailian/kimi-k2.5',
    systemPrompt:
      '你是营销问答助手。你的职责是输出产品卖点、销售口径、价格异议处理、竞品应对和活动政策解读。你的回答必须体现企业内部话术库、竞品战报和商机复盘差异，不要给泛泛的营销建议。优先给结论，再给推荐口径、场景化表达、判断依据、风险提醒和下一步动作。',
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
      '你是采购供应链助手。你的职责是提供供应商管理、采购流程、物料与价格比对建议。你可以帮助用户对 Amazon、Google、Walmart、Target、eBay，以及国内的淘宝、拼多多、京东等平台做商品价格和供应商信息对比。回答必须使用纯文本结构，先给结论，再给可执行步骤，突出流程节点、风控要点和审批注意事项。若用户要采购指导，请按完整流程回答：1) 明确需求与规格；2) 寻找与筛选供应商；3) 多平台比价与交期评估；4) 供应商资质审核；5) 打样/试采验证；6) 商务谈判与定价；7) 合同条款确认；8) 下单与交付跟踪；9) 到货验收；10) 对账结算；11) 供应商复盘与持续优化。',
  },
};

const assistantConfigByName = new Map(
  Object.values(assistantConfigs).map((config) => [config.name, config])
);

const fallbackAssistantConfig = assistantConfigs['assistant-production'];

const assistantDepartmentMap: Record<string, string> = {
  'assistant-rd': '研发部',
  'assistant-production': '生产部',
  'assistant-marketing': '营销部',
  'assistant-service': '客服部',
  'assistant-hr': '人力部',
  'assistant-procurement': '采购部',
};

const assistantCapabilityMap: Record<string, string> = {
  'assistant-rd':
    '我可以帮你梳理选型条件、比较技术方案、识别设计风险，并把问题收敛到可执行的工程判断。',
  'assistant-production':
    '我可以帮你梳理工艺步骤、排查生产异常、识别现场风险，并给出更可执行的处理顺序。',
  'assistant-marketing':
    '我可以帮你提炼产品卖点、整理价格异议口径、生成竞品应对话术，并把表达收敛到更适合客户沟通的版本。',
  'assistant-service':
    '我可以帮你整理客服回复、拆解故障初诊思路、优化服务表达，并补齐处理动作。',
  'assistant-hr':
    '我可以帮你解释制度口径、整理通知表达、优化行政文案，并回答常见人事流程问题。',
  'assistant-procurement':
    '我可以帮你梳理采购需求、比对供应商信息、整理沟通要点，并收敛采购决策动作。',
};

const searchableTerms = Array.from(
  new Set(
    knowledgeData.flatMap((item) => [
      item.title,
      item.category,
      item.department,
      item.source,
      ...item.tags,
    ])
  )
  )
  .filter((term) => term && term.length >= 2)
  .sort((a, b) => b.length - a.length);

const directGreetingPattern =
  /^(你好|您好|hi|hello|hey|在吗|早上好|上午好|中午好|下午好|晚上好|辛苦了|谢谢|多谢|谢了|收到|好的|明白了|再见|拜拜)[!！,.，。?？\s]*$/i;
const directCapabilityPattern =
  /(你是谁|你是干什么的|你能做什么|你会什么|介绍一下你自己|介绍下你自己|怎么用你|如何使用你|你支持什么|你可以帮我(做|干)什么|你的能力是什么)/i;
const directCasualPattern = /(随便聊聊|聊聊天|讲个笑话|你忙吗|你今天怎么样|你心情怎么样)/i;
const directWritingPattern =
  /(润色|改写|重写|翻译|总结|归纳|提炼|压缩|扩写|缩写|写一段|写个标题|生成一段|优化一下这段)/i;
const knowledgeSignalPattern =
  /(轴承|关节|液冷|冷板|流道|热管理|机械臂|减速器|电机|工艺|排查|故障|规范|标准|指南|案例|项目|月报|复盘|参数|载荷|寿命|压降|温差|材料|设计|选型|供应商|采购|比价|交期|合同|物料|bom|报价|售后|客服|制度|考勤|请假|审批|培训|卖点|话术|竞品|异议|商机|大客户|场景|roi|tco|演示|促销|活动政策)/i;
const hardRetrievalPattern =
  /(根据|参考|规范|标准|指南|制度|案例|项目|月报|复盘|参数|载荷|寿命|压降|温差|材料|设计|选型|流程|审批|采购|供应商|比价|交期|合同|物料|bom|工艺|排查|故障|轴承|关节|液冷|冷板|机械臂|卖点|话术|竞品|异议|商机|大客户|roi|tco|促销|政策)/i;

function getAssistantCapabilityLine(assistantId: string | undefined, assistantConfig: AssistantConfig): string {
  return assistantCapabilityMap[assistantId || ''] || `我是${assistantConfig.name}，可以先帮你把问题整理成更可执行的回答。`;
}

function detectResponseRoute(message: string): ResponseRoute {
  const normalized = message.trim();

  if (!normalized) {
    return 'direct';
  }

  const hasKnowledgeSignal =
    knowledgeSignalPattern.test(normalized) || extractKeywords(normalized).length > 0;

  if (directGreetingPattern.test(normalized)) {
    return 'direct';
  }

  if (directCapabilityPattern.test(normalized) || directCasualPattern.test(normalized)) {
    return 'direct';
  }

  if (directWritingPattern.test(normalized) && !hardRetrievalPattern.test(normalized)) {
    return 'direct';
  }

  if (
    normalized.length <= 14 &&
    /在吗|你好|您好|谢谢|收到|好的|明白|介绍一下|聊聊/.test(normalized) &&
    !hasKnowledgeSignal
  ) {
    return 'direct';
  }

  return 'knowledge';
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
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      temperature: 0.2,
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

function inferRepository(item: Pick<KnowledgeItem, 'title' | 'category' | 'type' | 'department'>): string {
  const text = `${item.title} ${item.category}`;

  if (/月报|复盘|案例/.test(text)) {
    return '历史案例库';
  }

  if (item.type === 'faq') {
    return '经验FAQ库';
  }

  if (/规范|标准|指南/.test(text)) {
    return `${item.department.replace(/部$/, '')}规范库`;
  }

  return `${item.department}知识库`;
}

function summarizeSnippet(content: string, maxLength = 92): string {
  const normalized = content.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength)}...`;
}

function toReference(hit: KnowledgeHit): ReferenceItem {
  return {
    id: hit.id,
    title: hit.title,
    repository: hit.repository,
    department: hit.department,
    source: hit.source,
    updateTime: hit.updateTime,
    snippet: summarizeSnippet(hit.content),
  };
}

function extractKeywords(input: string): string[] {
  const cleaned = input.toLowerCase();
  const matchedTerms = searchableTerms.filter((term) => cleaned.includes(term.toLowerCase()));
  const englishWords = cleaned.match(/[a-z0-9-]{2,}/g) || [];
  const chineseSegments = input.match(/[\u4e00-\u9fa5]{2,}/g) || [];

  const fallbackPieces = chineseSegments.flatMap((segment) => {
    const pieces: string[] = [];
    const maxSize = Math.min(4, segment.length);

    for (let size = maxSize; size >= 2; size -= 1) {
      for (let index = 0; index <= segment.length - size; index += 1) {
        const piece = segment.slice(index, index + size);
        if (searchableTerms.some((term) => term.includes(piece) || piece.includes(term))) {
          pieces.push(piece);
        }
      }
    }

    return pieces;
  });

  return Array.from(new Set([...matchedTerms, ...fallbackPieces, ...englishWords])).slice(0, 14);
}

function searchKnowledge(query: string, assistantId?: string): KnowledgeHit[] {
  const keywords = extractKeywords(query);
  const assistantDepartment = assistantId ? assistantDepartmentMap[assistantId] : undefined;

  if (keywords.length === 0) {
    return [];
  }

  return knowledgeData
    .map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      const tagsLower = item.tags.map((tag) => tag.toLowerCase());

      for (const keyword of keywords) {
        const lowerKeyword = keyword.toLowerCase();
        if (titleLower.includes(lowerKeyword)) score += 8;
        if (tagsLower.some((tag) => tag.includes(lowerKeyword))) score += 5;
        if (contentLower.includes(lowerKeyword)) score += 2;
      }

      if (assistantDepartment && item.department === assistantDepartment) {
        score += 4;
      }

      if (/月报|复盘|案例/.test(item.title) && /案例|复盘|月报|根因|失效|过热|异常/.test(query)) {
        score += 6;
      }

      if (/规范|标准|指南/.test(item.title) && /规范|标准|选型|设计|轴承|液冷|流程/.test(query)) {
        score += 5;
      }

      return {
        ...item,
        score,
        repository: inferRepository(item),
      };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function buildIntentDetail(message: string): string {
  const keywords = extractKeywords(message).slice(0, 4);
  if (!keywords.length) {
    return '已识别业务问题要点。';
  }

  return `问题要点：${keywords.join('、')}`;
}

function buildRetrievalTrace(params: {
  message: string;
  assistantId?: string;
  assistantConfig: AssistantConfig;
  kbHits: KnowledgeHit[];
  webSearchSnapshot: Awaited<ReturnType<typeof searchWeb>>;
  procurementMarketSnapshot: Awaited<ReturnType<typeof crawlMarketPrices>> | null;
}): RetrievalStep[] {
  const { message, assistantId, assistantConfig, kbHits, webSearchSnapshot, procurementMarketSnapshot } = params;
  const specHits = kbHits.filter((hit) => hit.repository.includes('规范库'));
  const caseHits = kbHits.filter((hit) => hit.repository === '历史案例库');
  const otherHits = kbHits.filter((hit) => !specHits.includes(hit) && !caseHits.includes(hit));
  const routeLabel =
    assistantId === 'assistant-rd'
      ? '进入研发规范库与历史案例库'
      : assistantId === 'assistant-marketing'
        ? '进入产品话术库、竞品战报库和商机复盘库'
      : `进入${assistantConfig.name}知识域`;
  const knowledgeStepTitle =
    assistantId === 'assistant-marketing'
      ? specHits.length
        ? '检索营销规则库'
        : '检索产品话术库'
      : specHits.length
        ? `检索${specHits[0].repository}`
        : '检索企业知识库';
  const caseStepTitle =
    assistantId === 'assistant-marketing' ? '检索商机复盘与案例库' : '检索历史案例库';

  const steps: RetrievalStep[] = [
    {
      id: 'intent',
      title: '解析问题意图',
      detail: buildIntentDetail(message),
      phase: 'intent',
    },
    {
      id: 'routing',
      title: '路由企业知识域',
      detail: routeLabel,
      phase: 'routing',
    },
  ];

  if (specHits.length) {
    steps.push({
      id: 'knowledge-spec',
      title: knowledgeStepTitle,
      detail: `命中 ${specHits.map((hit) => `《${hit.title}》`).join('、')}。`,
      phase: 'knowledge',
      files: specHits.slice(0, 2).map(toReference),
    });
  } else if (otherHits.length) {
    steps.push({
      id: 'knowledge-general',
      title: knowledgeStepTitle,
      detail: `命中 ${otherHits.map((hit) => `《${hit.title}》`).join('、')}。`,
      phase: 'knowledge',
      files: otherHits.slice(0, 2).map(toReference),
    });
  } else {
    steps.push({
      id: 'knowledge-miss',
      title: knowledgeStepTitle,
      detail: '未命中直接规则，转入相近资料。',
      phase: 'knowledge',
    });
  }

  if (caseHits.length) {
    steps.push({
      id: 'knowledge-case',
      title: caseStepTitle,
      detail: `命中 ${caseHits.map((hit) => `《${hit.title}》`).join('、')}。`,
      phase: 'case',
      files: caseHits.slice(0, 2).map(toReference),
    });
  }

  if (assistantId === 'assistant-procurement' && procurementMarketSnapshot?.items?.length) {
    steps.push({
      id: 'market-search',
      title: '检索供应商与价格渠道',
      detail: `抓取到 ${procurementMarketSnapshot.items.length} 条平台结果，用于比价和交期对照。`,
      phase: 'web',
    });
  } else if (!kbHits.length && webSearchSnapshot.items.length) {
    steps.push({
      id: 'web-search',
      title: '检索公开资料',
      detail: `补充 ${webSearchSnapshot.items.length} 条公开资料。`,
      phase: 'web',
    });
  }

  steps.push({
    id: 'answer-compose',
    title: '整理证据并生成回答',
    detail: `整理 ${kbHits.length || 0} 份资料并生成业务回答。`,
    phase: 'analysis',
    files: kbHits.slice(0, 3).map(toReference),
  });

  return steps;
}

async function buildRetrievalContext(params: {
  message: string;
  assistantId?: string;
  assistantConfig: AssistantConfig;
}): Promise<RetrievalContext> {
  const { message, assistantId, assistantConfig } = params;

  const [kbHits, webSearchSnapshot, procurementMarketSnapshot] = await Promise.all([
    Promise.resolve(searchKnowledge(message, assistantId)),
    searchWeb(message),
    assistantId === 'assistant-procurement' ? crawlMarketPrices(message) : Promise.resolve(null),
  ]);

  return {
    kbHits,
    references: kbHits.map(toReference),
    retrievalTrace: buildRetrievalTrace({
      message,
      assistantId,
      assistantConfig,
      kbHits,
      webSearchSnapshot,
      procurementMarketSnapshot,
    }),
    webSearchSnapshot,
    procurementMarketSnapshot,
  };
}

function buildKnowledgePrompt(context: RetrievalContext, assistantId?: string): string {
  if (!context.kbHits.length) {
    return '当前企业知识库未命中与用户问题直接相关的资料。你必须明确说“当前企业知识库未检索到直接规则”，然后再补充通用建议，禁止虚构内部文档。';
  }

  const documents = context.kbHits
    .map(
      (hit, index) =>
        `${index + 1}. 文档标题：${hit.title}\n文档归属：${hit.repository} / ${hit.department} / ${hit.source}\n更新时间：${hit.updateTime}\n内容摘录：${hit.content.slice(0, 700)}`
    )
    .join('\n\n');

  const answerRules =
    assistantId === 'assistant-marketing'
      ? [
          '你不是通用营销问答，请把企业内部话术库、竞品战报和商机复盘作为主依据。',
          '首句必须使用“根据《文档A》”，若有第二份或更多资料，继续使用“，参考《文档B》”。',
          '输出结构固定为：结论摘要： / 推荐口径： / 场景化表达： / 判断依据： / 风险提醒： / 下一步建议：。',
          '回答顺序必须严格按上面的结构展开，不要跳段，不要把风险提醒和下一步建议混在一起。',
          '结论摘要、推荐口径、场景化表达、下一步建议必须写得具体，不能只给抽象方法论。',
          '如果用户问卖点，必须收敛为2到4个最该优先讲的点，并明确适用客户场景。',
          '如果用户问价格异议，必须写出主回应句、展开解释和回收提问三层口径。',
          '如果用户问竞品对比，必须明确哪些点可以讲、哪些点不要承诺，以及适用前提。',
          '如果命中了商机复盘或案例，要说明这些复盘对当前客户沟通的启发。',
          '若内容适合横向对比，可以使用标准 Markdown 表格；除表格外，尽量使用短段落和编号列表。',
          '不要输出“作为AI”“一般来说”“通常情况下”“建议突出价值”这类空泛表述。',
          '不要输出“参考资料”“参考文档”这类尾注，资料来源由界面单独展示。',
          '只能引用当前提供的企业资料标题，严禁虚构新的客户案例、价格政策或产品参数。',
        ]
      : [
          '你不是通用大模型问答，请把企业知识作为主依据。',
          '首句必须使用“根据《文档A》”，若有第二份或更多资料，继续使用“，参考《文档B》”。',
          '输出结构固定为：结论摘要： / 判断依据： / 关键判断： / 风险与边界： / 建议动作： / 待确认信息：。',
          '回答顺序必须严格按上面的结构展开，不要跳段，不要把风险和建议混在一起。',
          '结论摘要、关键判断、风险与边界、建议动作这四部分必须写详细，每部分至少2条或2句，不要只写一句。',
          '如果是研发选型问题，要明确推荐方案、备选方案，以及不推荐方案或不建议直接采用的方案。',
          '如果文档里有参数、寿命、载荷、温差、压降、精度、材料等级等信息，要尽量带出来，不要笼统概括。',
          '如果命中了项目月报、失效复盘或历史案例，必须明确说明这些案例对当前判断的启发。',
          '若内容适合横向对比，可以使用标准 Markdown 表格；除表格外，尽量使用短段落和编号列表。',
          '不要输出“作为AI”“一般来说”“通常情况下”这类空泛表述。',
          '不要输出“参考资料”“参考文档”这类尾注，资料来源由界面单独展示。',
          '只能引用当前提供的企业资料标题，严禁虚构新的公司制度、规范或项目名称。',
        ];

  return `以下是企业知识库命中内容，请严格基于这些资料作答：\n\n${documents}\n\n回答硬性要求：\n${answerRules
    .map((rule, index) => `${index + 1}. ${rule}`)
    .join('\n')}`;
}

function buildWebSearchPrompt(params: {
  context: RetrievalContext;
  assistantId?: string;
}): string {
  const { context, assistantId } = params;
  const shouldUseWebSearch = assistantId === 'assistant-procurement' || !context.kbHits.length;
  const hasWebSearchMatch = context.webSearchSnapshot.items.length > 0;

  if (!shouldUseWebSearch) {
    return '当前已命中企业内部资料，无需额外引入外部公开资料。';
  }

  const searchPrompt = hasWebSearchMatch
    ? `以下是联网搜索结果，请把它作为最新外部信息的补充对照，不得覆盖企业规范结论：\n\n${formatWebSearchSnapshot(
        context.webSearchSnapshot
      )}\n\n使用要求：\n1. 企业内部规范优先。\n2. 外部搜索只补充公开事实，不替代内部规则。\n3. 若冲突，明确指出差异并说明以哪一方为准。`
    : '当前未抓到可用的联网搜索结果。请基于已有企业资料或通用知识回答，不要编造外部来源。';

  if (assistantId !== 'assistant-procurement') {
    return searchPrompt;
  }

  const procurementPrompt = context.procurementMarketSnapshot
    ? `以下是多平台爬虫抓取到的价格/供应商结果，请把它作为采购建议的重要依据：\n\n${formatMarketSnapshot(
        context.procurementMarketSnapshot
      )}\n\n回答要求：\n1. 优先给出适合采购决策的结论。\n2. 对比价格、卖家、运费、评分、交期等信息。\n3. 结果不完整时，要明确提示用户补充品牌、型号、规格或数量。`
    : '当前未能抓取到可用的多平台价格结果。请继续基于采购知识给出建议，并明确说明系统支持对 Amazon、Google、Walmart、Target、eBay、淘宝、拼多多、京东等平台进行价格抓取。';

  return `${searchPrompt}\n\n${procurementPrompt}`;
}

function buildDirectPrompt(params: {
  assistantId?: string;
  assistantConfig: AssistantConfig;
}): string {
  const { assistantId, assistantConfig } = params;
  const capabilityLine = getAssistantCapabilityLine(assistantId, assistantConfig);

  return `${assistantConfig.systemPrompt}

当前问题属于闲聊、能力说明或无需企业知识检索的直接问答。

回答要求：
1. 直接回答，不要展示检索过程，不要伪装调用知识库。
2. 不要写“根据《某文档》”“参考《某案例》”之类的引用句式。
3. 如果用户是在打招呼、致谢或闲聊，回复控制在1到3句。
4. 如果用户是在问你能做什么，要结合你的职责说明具体能处理的事项，不要空泛。
5. 如果用户是在做润色、改写、总结、翻译等简单文本处理，直接执行，不要先讲方法。
6. 如果需要横向对比信息，可以使用标准 Markdown 表格；其他内容优先用短段落和编号列表。

你的职责补充说明：
${capabilityLine}`;
}

function ensureGroundedAnswer(answer: string, context: RetrievalContext, assistantId?: string): string {
  let normalized = toPlainTextDocument(answer);

  if (!normalized) {
    return normalized;
  }

  normalized = normalized
    .replace(/\n{0,2}参考资料[:：][\s\S]*$/i, '')
    .replace(/\n{0,2}参考文档[:：][\s\S]*$/i, '')
    .replace(/\n{0,2}参考来源[:：][\s\S]*$/i, '')
    .replace(/(^|\n)结论[:：]/g, '$1结论摘要：')
    .replace(/(^|\n)依据[:：]/g, '$1判断依据：')
    .replace(/(^|\n)技术判断[:：]/g, '$1关键判断：')
    .replace(/(^|\n)风险点[:：]/g, '$1风险与边界：')
    .replace(/(^|\n)待补充信息[:：]/g, '$1待确认信息：');

  if (assistantId === 'assistant-marketing') {
    normalized = normalized
      .replace(/(^|\n)话术建议[:：]/g, '$1推荐口径：')
      .replace(/(^|\n)推荐话术[:：]/g, '$1推荐口径：')
      .replace(/(^|\n)场景表达[:：]/g, '$1场景化表达：')
      .replace(/(^|\n)场景建议[:：]/g, '$1场景化表达：')
      .replace(/(^|\n)风险与边界[:：]/g, '$1风险提醒：')
      .replace(/(^|\n)风险点[:：]/g, '$1风险提醒：')
      .replace(/(^|\n)建议动作[:：]/g, '$1下一步建议：');
  }

  if (context.references.length) {
    const leadingDocs = context.references.slice(0, 2).map((item) => `《${item.title}》`);
    const leadLine =
      leadingDocs.length > 1
        ? `根据${leadingDocs[0]}，参考${leadingDocs[1]}，`
        : `根据${leadingDocs[0]}，`;

    if (!normalized.startsWith('根据《')) {
      normalized = `${leadLine}${normalized}`;
    }
  } else if (!normalized.includes('当前企业知识库未检索到直接规则')) {
    normalized = `当前企业知识库未检索到直接规则。\n\n${normalized}`;
  }

  return normalized.trim();
}

function ensureDirectAnswer(answer: string): string {
  return toPlainTextDocument(answer)
    .replace(/\n{0,2}参考资料[:：][\s\S]*$/i, '')
    .replace(/\n{0,2}参考文档[:：][\s\S]*$/i, '')
    .replace(/\n{0,2}参考来源[:：][\s\S]*$/i, '')
    .replace(/^根据《[^》]+》[，,\s]*/i, '')
    .replace(/^参考《[^》]+》[，,\s]*/i, '')
    .trim();
}

function buildDemoFallbackAnswer(params: {
  message: string;
  context: RetrievalContext;
  assistantId?: string;
}): string {
  const { message, context, assistantId } = params;

  if (!context.references.length) {
    if (assistantId === 'assistant-marketing') {
      return `当前企业知识库未检索到直接规则。

结论摘要：
当前可以先给出一轮营销判断，但不建议直接形成对外定稿话术。

推荐口径：
建议先确认客户行业、项目阶段、核心关注点和对比对象，再决定主打卖点、价格口径还是竞品应对。

场景化表达：
如果你告诉我是首轮拜访、方案演示、价格谈判还是竞品对比阶段，我可以直接改成对应场景的话术。

判断依据：
本次未命中可直接引用的企业话术库、竞品战报或商机复盘资料。

风险提醒：
在缺少客户场景和内部口径的情况下，直接输出对外话术容易显得空泛，或与真实销售策略不一致。

下一步建议：
1. 补充客户行业、项目阶段、当前异议点和对比竞品。
2. 在知识库中补充对应话术手册、竞品战报或商机复盘后再生成正式口径。
`;
    }

    return `当前企业知识库未检索到直接规则。

结论摘要：
建议先给出初步工程判断，并补充缺失参数后再细化。

判断依据：
本次未命中可直接引用的企业文档。

关键判断：
当前只能基于通用工程逻辑做一轮初判，不能直接替代企业内部定版方案。

风险与边界：
如果缺少项目工况、寿命目标和结构约束，直接给定型结论容易造成选型偏差。

建议动作：
1. 补充更具体的型号、工况、负载或设计对象。
2. 在知识库中补充对应规范、历史案例或BOM白名单后再进行问答。

待确认信息：
请补充核心参数、目标寿命、约束条件或项目背景。
`;
  }

  const evidenceLines = context.kbHits
    .slice(0, 3)
    .map((hit) => `- ${hit.title}：${summarizeSnippet(hit.content, 88)}`)
    .join('\n');
  const leadingDocs = context.references.slice(0, 2).map((item) => `《${item.title}》`);
  const citationLead =
    leadingDocs.length > 1
      ? `根据${leadingDocs[0]}，参考${leadingDocs[1]}`
      : `根据${leadingDocs[0]}`;

  if (assistantId === 'assistant-marketing') {
    if (/价格|太贵|偏高|单价|预算/.test(message)) {
      return `${citationLead}，当前更适合的销售口径不是直接围绕单价拉锯，而是把讨论拉回到精度、换型效率、停机损失和总拥有成本。

结论摘要：
面对价格异议时，主线应从“价格高不高”切换到“值不值得买”和“上线后能不能稳定回本”。对新能源装配客户，优先讲精度稳定、换型效率和停机损失，不建议先报折扣。

推荐口径：
1. 主回应句：R-200的报价确实不属于入门档，但它不是通用搬运臂，而是面向精密装配和高频切换场景做过强化，价值重点在稳定良率和低停机。
2. 展开解释：如果客户现场更关注装配精度、换型节拍和售后停机损失，R-200的优势不在“便宜”，而在于后续返修、换型和维护成本更可控。
3. 回收提问：我先确认一下，您当前更看重一次性采购成本，还是更看重上线后的良率、节拍和维护成本？

场景化表达：
1. 如果客户是电芯辅料装配或精密锁附场景，优先强调±0.02mm重复定位精度和多工位换型效率。
2. 如果客户拿低价搬运型机械臂来比，建议明确两者目标场景不同，避免陷入“单价对单价”的比较。
3. 如果客户已经进入样机验证阶段，可以把话题引到POC验证和总拥有成本测算，而不是先让价。

判断依据：
${evidenceLines}

风险提醒：
1. 不要直接承诺“最低价”或“绝对回本周期”，避免后续交付和商务风险。
2. 不要在未确认客户工位、节拍和精度要求前，泛化使用“性价比最高”这类口径。
3. 若客户重点是标准搬运而非精密装配，强推高配方案会降低说服力。

下一步建议：
1. 先确认客户工位类型、换型频率、节拍目标和精度要求。
2. 若客户有竞品对照，补一页总拥有成本或停机损失对比口径。
3. 若进入中后期商机，建议安排样机验证或场景化演示，把讨论从价格转到结果。
`;
    }

    if (/竞品|对比|cr-7|差异/.test(message)) {
      return `${citationLead}，如果客户拿CR-7七公斤级协作机械臂来做对比，营销上更推荐把R-200和它的差异收敛在“精度稳定性、换型效率、维护成本和项目落地经验”四个维度，不建议泛化成全面领先。

结论摘要：
当前更适合的竞品应对口径是“按场景打差异”，而不是全维度压竞品。对精密装配和多品种换型场景，R-200相对CR-7七公斤级协作机械臂的说服点更强；对纯搬运或极致低价项目，不建议过度承诺。

推荐口径：
1. 主回应句：如果项目核心是精密装配、频繁换型和后期维护稳定性，R-200更适合；如果只是标准搬运，选型逻辑会不一样。
2. 可讲优势：重复定位精度、换型时间、模块化维护、公司已有热管理与关节可靠性经验。
3. 不建议讲法：不要直接说竞品不行，建议改成“适用场景不同，项目关注点不同”。

场景化表达：
1. 对新能源装配线客户，先讲精度和换型，再补充售后停机和维护效率。
2. 对已经被竞品卡价格的客户，先稳住应用场景差异，再讲总拥有成本。
3. 对招投标场景，口径应更收敛，突出参数边界和交付经验，不要口头放大未验证能力。

判断依据：
${evidenceLines}

风险提醒：
1. 未经验证的参数、交期和客户案例不要直接承诺。
2. 不要为了压竞品而把所有卖点都堆上去，容易显得不专业。
3. 若客户实际需求偏向低价标准搬运，继续强推高配方案会降低转化。

下一步建议：
1. 先确认客户当前对比的是哪一款竞品、卡的是价格还是场景适配。
2. 按客户工位把对比收敛到3个以内核心差异点。
3. 若进入深度商机，补充演示方案、POC计划或总拥有成本测算资料。
`;
    }

    if (/卖点|怎么介绍|首推|场景|亮点/.test(message)) {
      return `${citationLead}，如果面向新能源装配客户，当前最值得优先讲的不是“大而全”的产品介绍，而是精度、换型、维护和可靠性四个能直接影响客户上线效果的点。

结论摘要：
营销上建议先收敛为3到4个核心卖点，再按客户工位补充场景化表达。对于电芯辅料装配、精密锁附和多品种小批量产线，R-200的说服逻辑已经比较清晰。

推荐口径：
1. 第一卖点：高精度协作装配，重复定位精度稳定在±0.02mm，适合精密装配和检测上下料。
2. 第二卖点：高节拍与柔性切换，支持多工位快速切换，单站换型时间可缩短到15分钟以内。
3. 第三卖点：易维护与低停机，模块化关节和线缆设计让常规保养更快，降低售后等待和停机损失。
4. 第四卖点：公司在关节热管理和可靠性上有项目沉淀，能降低后期返修风险。

场景化表达：
1. 面向电芯辅料装配客户，先讲精度和节拍稳定性。
2. 面向多品种小批量客户，先讲换型效率和配方管理。
3. 面向运维敏感型客户，先讲模块化维护和低停机。

判断依据：
${evidenceLines}

风险提醒：
1. 不要在开场时把所有卖点平铺出来，容易缺少重点。
2. 不要脱离客户场景空讲技术术语，尤其是第一次沟通时。
3. 若客户当前更关心预算或交期，应及时把口径切到总拥有成本或项目节奏。

下一步建议：
1. 先确认客户所属行业、工位类型和当前最关注的采购指标。
2. 按客户场景只保留3个最相关卖点，避免信息过载。
3. 若需要，我可以继续把这套卖点改成首轮拜访话术或演示开场白。
`;
    }
  }

  if (/机械臂|关节|轴承/.test(message)) {
    return `${citationLead}，如果这是承受径向载荷、轴向载荷和倾覆力矩的机械臂关节，不建议直接使用通用深沟球轴承，优先评估交叉滚子轴承；只有在轻载高速、安装空间受限的末端关节，才建议进一步比较薄壁角接触轴承方案。

结论摘要：
当前更接近企业口径的建议是“先按交叉滚子轴承方向选型，再根据负载、减速器形式和寿命目标细化型号”，而不是直接给一个通用轴承品类。

判断依据：
${evidenceLines}

关键判断：
1. 对承受径向载荷、轴向载荷和倾覆力矩的关节，刚度和游隙控制比单纯低成本更重要，因此主方案应优先放在交叉滚子轴承。
2. 如果关节空间受限且转速更高，可以把薄壁角接触轴承作为备选，但前提是完成成对布置、预紧和寿命校核。
3. 不建议在未完成倾覆力矩校核和耐久验证前，直接采用普通深沟球轴承作为主支撑方案。

风险与边界：
1. 只按静态载荷选型，容易忽略频繁启停带来的冲击和润滑保持问题。
2. 若装配同轴度、预紧和密封设计控制不到位，即使轴承型式正确，也可能出现温升、异响和定位漂移。
3. 若项目工况接近高频往复场景，需要重点关注热积累和润滑脂析油风险。

建议动作：
1. 先补充关节位置、减速器形式、峰值力矩、转速、寿命目标和安装空间。
2. 对候选轴承同步校核倾覆力矩、游隙控制、预载方案和润滑保持能力。
3. 若项目场景接近宁德时代案例，需重点核查预载不足、密封等级和启停冲击。

待确认信息：
关节工位、负载谱、目标寿命、安装空间、是否直连谐波减速器。
`;
  }

  if (/液冷|冷板|流道|热管理/.test(message)) {
    return `${citationLead}，液冷板流道设计不能只看散热能力，必须同时校核流速、压降、进出液温差、密封寿命和维护空间。

结论摘要：
企业内部更强调“热性能、压降和密封可靠性”的综合平衡，而不是单看单点温度。

判断依据：
${evidenceLines}

关键判断：
1. 液冷板流道设计不能只追求换热效率，必须同步兼顾压降、流速上限和维护空间，否则后续泵选型与系统稳定性会出问题。
2. 若器件贴合区域温差控制不住，即使平均温度达标，也可能造成局部性能漂移和寿命下降。
3. 材料和密封介质不匹配时，后续泄漏与腐蚀风险会明显上升，因此材料、密封和介质兼容性要一起看。

风险与边界：
1. 流速过高会带来局部冲蚀和噪音问题，流速过低又会影响换热均匀性。
2. 只做热仿真不做保压和热循环验证，容易把真实装配和密封问题留到试产后暴露。
3. 如果泵余量和快接头密封冗余不足，现场波动工况下会放大泄漏和温升风险。

建议动作：
1. 先完成热仿真、压降计算和泄漏风险清单。
2. 控制主流道流速在规范建议范围内，并校核功率器件贴合区域温差。
3. 首样阶段补做热循环、耐压保压和介质兼容验证。

待确认信息：
冷却介质、目标功耗、进液温度、允许压降、泵规格、维护约束。
`;
  }

  return `${citationLead}，

结论摘要：
建议优先执行命中的企业规范，并用历史案例校核风险点。

判断依据：
${evidenceLines}

关键判断：
1. 当前问题已有可参考的内部规范和案例，优先级应放在把内部要求落到当前项目参数和工况上。
2. 若历史案例与当前项目场景接近，应把案例中的失效根因和整改动作前置到设计评审或方案评审阶段。

风险与边界：
1. 若只引用规范、不结合当前项目边界条件，容易出现“文档命中了但结论不落地”的问题。
2. 若忽略案例中的失效机理，可能在试产或售后阶段重复踩坑。

建议动作：
1. 先按命中文档执行当前设计或流程要求。
2. 若当前项目与历史案例相似，补充案例中的整改动作和风险校核项。
3. 信息不足时，继续补充型号、工况和项目背景后再细化建议。

待确认信息：
请补充与问题直接相关的参数、场景和项目背景。
`;
}

function buildDirectFallbackAnswer(params: {
  message: string;
  assistantId?: string;
  assistantConfig: AssistantConfig;
}): string {
  const { message, assistantId, assistantConfig } = params;
  const normalized = message.trim();
  const capabilityLine = getAssistantCapabilityLine(assistantId, assistantConfig);

  if (directCapabilityPattern.test(normalized)) {
    return `我是${assistantConfig.name}。${capabilityLine} 你可以直接把问题、目标或要处理的内容发给我。`;
  }

  if (/谢谢|多谢|辛苦了/i.test(normalized)) {
    return '不客气。你有具体问题时直接发场景和目标，我会继续往下处理。';
  }

  if (/^(你好|您好|hi|hello|hey|在吗|早上好|上午好|中午好|下午好|晚上好)/i.test(normalized)) {
    return `你好，我是${assistantConfig.name}。${capabilityLine}`;
  }

  return `我是${assistantConfig.name}。${capabilityLine}`;
}

async function generateChatPayload(params: {
  message: string;
  assistantId?: string;
  assistantName?: string;
  history?: ChatMessage[];
  assistantConfig: AssistantConfig;
  baseUrl: string;
  apiKey?: string;
  responseRoute: ResponseRoute;
  context?: RetrievalContext;
}): Promise<StreamPayload> {
  const { message, assistantId, history, assistantConfig, baseUrl, apiKey, context, responseRoute } = params;
  const hasKbMatch = context?.kbHits.length ? context.kbHits.length > 0 : false;
  const hasWebSearchMatch = context?.webSearchSnapshot.items.length
    ? context.webSearchSnapshot.items.length > 0
    : false;
  const safeHistory = Array.isArray(history)
    ? history
        .filter((item) => item && (item.role === 'user' || item.role === 'assistant'))
        .slice(-8)
        .map((item) => ({ role: item.role, content: String(item.content || '') }))
    : [];
  const systemPrompt =
    responseRoute === 'knowledge' && context
      ? `${assistantConfig.systemPrompt}\n\n${buildKnowledgePrompt(context, assistantId)}\n\n${buildWebSearchPrompt({
          context,
          assistantId,
        })}`
      : buildDirectPrompt({
          assistantId,
          assistantConfig,
        });

  if (!apiKey) {
    const answer =
      responseRoute === 'knowledge' && context
        ? buildDemoFallbackAnswer({ message, context, assistantId })
        : buildDirectFallbackAnswer({ message, assistantId, assistantConfig });
    return {
      answer,
      model: 'demo-fallback',
      assistantName: assistantConfig.name,
      responseRoute,
      answerMode: 'fallback',
      kbMatched: hasKbMatch,
      webMatched: hasWebSearchMatch,
      references: context?.references || [],
      retrievalTrace: context?.retrievalTrace || [],
      webSearchDebug: context?.webSearchSnapshot.debug || null,
      marketDebug: context?.procurementMarketSnapshot?.debug || null,
    };
  }

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: systemPrompt,
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

    const errorText = await upstreamResponse.text();
    console.error(`Bailian API Error [${model}]:`, errorText);
  }

  if (!data) {
    const answer =
      responseRoute === 'knowledge' && context
        ? buildDemoFallbackAnswer({ message, context, assistantId })
        : buildDirectFallbackAnswer({ message, assistantId, assistantConfig });
    return {
      answer,
      model: 'demo-fallback',
      assistantName: assistantConfig.name,
      responseRoute,
      answerMode: 'fallback',
      kbMatched: hasKbMatch,
      webMatched: hasWebSearchMatch,
      references: context?.references || [],
      retrievalTrace: context?.retrievalTrace || [],
      webSearchDebug: context?.webSearchSnapshot.debug || null,
      marketDebug: context?.procurementMarketSnapshot?.debug || null,
    };
  }

  const answer =
    responseRoute === 'knowledge' && context
      ? ensureGroundedAnswer(extractAnswerFromModelResponse(data), context, assistantId)
      : ensureDirectAnswer(extractAnswerFromModelResponse(data));

  if (!answer) {
    console.error('Bailian Empty Content:', JSON.stringify(data));
    throw new Error('大模型返回内容为空。');
  }

  return {
    answer,
    model: usedModel,
    assistantName: assistantConfig.name,
    responseRoute,
    answerMode: 'model',
    kbMatched: hasKbMatch,
    webMatched: hasWebSearchMatch,
    references: context?.references || [],
    retrievalTrace: context?.retrievalTrace || [],
    webSearchDebug: context?.webSearchSnapshot.debug || null,
    marketDebug: context?.procurementMarketSnapshot?.debug || null,
  };
}

function createLiveStreamingChatResponse(params: {
  message: string;
  assistantId?: string;
  assistantName?: string;
  history?: ChatMessage[];
  assistantConfig: AssistantConfig;
  baseUrl: string;
  apiKey?: string;
}): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const responseRoute = detectResponseRoute(params.message);

      controller.enqueue(
        encoder.encode(
          createSseEvent('meta', {
            status: 'started',
            responseRoute,
            ...(responseRoute === 'knowledge'
              ? { statusText: '正在解析问题并检索企业知识库…' }
              : {}),
          })
        )
      );

      try {
        let context: RetrievalContext | undefined;

        if (responseRoute === 'knowledge') {
          context = await buildRetrievalContext({
            message: params.message,
            assistantId: params.assistantId,
            assistantConfig: params.assistantConfig,
          });

          controller.enqueue(
            encoder.encode(
              createSseEvent('meta', {
                status: 'retrieving',
                responseRoute,
                kbMatched: context.kbHits.length > 0,
                webMatched: context.webSearchSnapshot.items.length > 0,
                references: context.references,
              })
            )
          );

          for (const step of context.retrievalTrace) {
            controller.enqueue(encoder.encode(createSseEvent('trace', { step })));
          }
        }

        const payload = await generateChatPayload({
          ...params,
          responseRoute,
          context,
        });

        controller.enqueue(
          encoder.encode(
            createSseEvent('meta', {
              model: payload.model,
              assistantName: payload.assistantName,
              responseRoute: payload.responseRoute,
              answerMode: payload.answerMode,
              kbMatched: payload.kbMatched,
              webMatched: payload.webMatched,
              references: payload.references,
              retrievalTrace: payload.retrievalTrace,
              webSearchDebug: payload.webSearchDebug,
              marketDebug: payload.marketDebug,
            })
          )
        );

        for (const chunk of splitIntoChunks(payload.answer)) {
          controller.enqueue(encoder.encode(createSseEvent('delta', { content: chunk })));
          await wait(12);
        }

        controller.enqueue(
          encoder.encode(
            createSseEvent('done', {
              answer: payload.answer,
              model: payload.model,
              assistantName: payload.assistantName,
              responseRoute: payload.responseRoute,
              answerMode: payload.answerMode,
              kbMatched: payload.kbMatched,
              webMatched: payload.webMatched,
              references: payload.references,
              retrievalTrace: payload.retrievalTrace,
              webSearchDebug: payload.webSearchDebug,
              marketDebug: payload.marketDebug,
            })
          )
        );
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            createSseEvent('error', {
              message: error instanceof Error ? error.message : '服务器内部错误，请稍后重试',
            })
          )
        );
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, assistantId, assistantName, history } = body as {
      message?: string;
      assistantId?: string;
      assistantName?: string;
      history?: ChatMessage[];
    };

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
        error: '服务器内部错误，请稍后重试',
      },
      { status: 500 }
    );
  }
}
