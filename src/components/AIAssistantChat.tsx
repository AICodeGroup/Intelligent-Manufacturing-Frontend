'use client';

import FullLogo from '@/../public/full-logo.svg'; 
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  Mic,
  Paperclip,
  RotateCcw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  User,
} from 'lucide-react';
import { aiAssistants, aiResponses } from '@/lib/demo-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIAssistantChatProps {
  assistantId?: string;
  onBack?: () => void;
}

type TracePhase = 'intent' | 'routing' | 'knowledge' | 'case' | 'web' | 'analysis';
type AnswerMode = 'model' | 'fallback';
type ResponseRoute = 'direct' | 'knowledge';

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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  responseRoute?: ResponseRoute;
  references?: ReferenceItem[];
  retrievalTrace?: RetrievalStep[];
  activeTrace?: RetrievalStep;
  answerMode?: AnswerMode;
  statusText?: string;
  bufferedContent?: string;
  traceDone?: boolean;
  referencesVisible?: boolean;
}

type MessageBlock =
  | {
      type: 'text';
      content: string;
    }
  | {
      type: 'table';
      headers: string[];
      rows: string[][];
    };

const buildWelcomeMessage = (assistantKey: string): Message => {
  const defaultResponse = aiResponses[assistantKey]?.default || '您好，有什么可以帮助您的？';
  return {
    id: `welcome-${assistantKey}`,
    role: 'assistant',
    content: defaultResponse,
    timestamp: new Date(),
  };
};

const colorMap: Record<string, { bg: string; text: string; gradient: string }> = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    gradient: 'from-green-500 to-emerald-500',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-500 to-red-500',
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    gradient: 'from-cyan-500 to-blue-500',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500 to-orange-500',
  },
};

const assistantKnowledgeBadges: Record<string, string[]> = {
  'assistant-rd': ['企业知识库', '规范库', '历史案例库'],
  'assistant-production': ['工艺参数库', '设备维护库', '异常案例库'],
  'assistant-marketing': ['产品话术库', '竞品战报库', '商机复盘库'],
  'assistant-service': ['服务流程库', 'FAQ库', '工单案例库'],
  'assistant-hr': ['制度库', '流程库', '培训规范库'],
  'assistant-procurement': ['供应商库', '流程库', '价格渠道库'],
};

function mergeTraceSteps(current: RetrievalStep[] = [], incoming: RetrievalStep[] = []): RetrievalStep[] {
  const merged = new Map<string, RetrievalStep>();

  for (const step of current) {
    merged.set(step.id, step);
  }

  for (const step of incoming) {
    merged.set(step.id, step);
  }

  return Array.from(merged.values());
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTraceDelay(step: RetrievalStep): number {
  switch (step.phase) {
    case 'intent':
      return 1500;
    case 'routing':
      return 1900;
    case 'knowledge':
      return 2600;
    case 'case':
      return 2900;
    case 'web':
      return 2300;
    case 'analysis':
      return 1800;
    default:
      return 1600;
  }
}

function getTraceLoadingText(step: RetrievalStep): string {
  switch (step.phase) {
    case 'intent':
      return '正在识别问题要点...';
    case 'routing':
      return '正在匹配知识域...';
    case 'knowledge':
      return '正在检索规范资料...';
    case 'case':
      return '正在检索历史案例...';
    case 'web':
      return '正在补充公开资料...';
    case 'analysis':
      return '正在整理证据并生成回答...';
    default:
      return '处理中...';
  }
}

function isKnowledgeRoute(route?: ResponseRoute) {
  return route === 'knowledge';
}

function isMarkdownTableSeparator(line: string) {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) {
    return false;
  }

  const cells = trimmed
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
    .filter(Boolean);

  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function splitMarkdownTableCells(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isMarkdownTableRow(line: string) {
  const trimmed = line.trim();
  if (!trimmed || !trimmed.includes('|')) {
    return false;
  }

  const cells = splitMarkdownTableCells(trimmed);
  return cells.length >= 2 && cells.some((cell) => cell.length > 0);
}

function normalizeTableRows(headers: string[], rows: string[][]) {
  const columnCount = Math.max(headers.length, ...rows.map((row) => row.length));

  const normalizedHeaders =
    headers.length < columnCount
      ? [...headers, ...Array.from({ length: columnCount - headers.length }, () => '')]
      : headers;

  const normalizedRows = rows.map((row) =>
    row.length < columnCount
      ? [...row, ...Array.from({ length: columnCount - row.length }, () => '')]
      : row.slice(0, columnCount)
  );

  return { headers: normalizedHeaders, rows: normalizedRows };
}

function parseMessageBlocks(content: string): MessageBlock[] {
  const lines = content.split('\n');
  const blocks: MessageBlock[] = [];
  let textBuffer: string[] = [];

  const flushText = () => {
    const text = textBuffer.join('\n').trim();
    if (text) {
      blocks.push({ type: 'text', content: text });
    }
    textBuffer = [];
  };

  let index = 0;
  while (index < lines.length) {
    const currentLine = lines[index];
    const nextLine = lines[index + 1];

    if (nextLine && isMarkdownTableSeparator(nextLine) && isMarkdownTableRow(currentLine)) {
      flushText();

      const headers = splitMarkdownTableCells(currentLine);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && isMarkdownTableRow(lines[index])) {
        rows.push(splitMarkdownTableCells(lines[index]));
        index += 1;
      }

      const normalizedTable = normalizeTableRows(headers, rows);
      blocks.push({ type: 'table', headers: normalizedTable.headers, rows: normalizedTable.rows });
      continue;
    }

    textBuffer.push(currentLine);
    index += 1;
  }

  flushText();

  if (blocks.length === 0 && content.trim()) {
    return [{ type: 'text', content: content.trim() }];
  }

  return blocks;
}

function renderMessageContent(content: string, role: Message['role']) {
  const blocks = parseMessageBlocks(content);
  const textClassName = cn(
    'text-sm leading-relaxed whitespace-pre-line text-left',
    role === 'user' ? 'text-white' : 'text-gray-700 dark:text-gray-200'
  );
  const tableShellClassName = cn(
    'overflow-x-auto rounded-xl border',
    role === 'user'
      ? 'border-white/15 bg-white/10'
      : 'border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-slate-950/60'
  );
  const headerCellClassName = cn(
    'px-3 py-2 text-left text-xs font-semibold',
    role === 'user'
      ? 'border-b border-white/15 bg-white/10 text-white/90'
      : 'border-b border-gray-200 bg-gray-100/80 text-gray-700 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-200'
  );
  const bodyCellClassName = cn(
    'px-3 py-2 align-top text-sm leading-relaxed whitespace-pre-line',
    role === 'user'
      ? 'border-t border-white/10 text-white/90'
      : 'border-t border-gray-100 text-gray-600 dark:border-gray-800 dark:text-gray-300'
  );

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === 'text') {
          return (
            <div key={`text-${index}`} className={textClassName}>
              {block.content}
            </div>
          );
        }

        return (
          <div key={`table-${index}`} className={tableShellClassName}>
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {block.headers.map((header, headerIndex) => (
                    <th key={`header-${headerIndex}`} className={headerCellClassName}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`cell-${rowIndex}-${cellIndex}`} className={bodyCellClassName}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default function AIAssistantChat({
  assistantId = 'assistant-production',
  onBack,
}: AIAssistantChatProps) {
  const [selectedAssistant, setSelectedAssistant] = useState(assistantId);
  const [assistantHistories, setAssistantHistories] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const traceQueueRef = useRef<Record<string, RetrievalStep[]>>({});
  const traceProcessingRef = useRef<Record<string, boolean>>({});
  const seenTraceStepIdsRef = useRef<Record<string, Set<string>>>({});
  const referenceTimersRef = useRef<Record<string, number>>({});

  const assistant = aiAssistants.find((item) => item.id === selectedAssistant)!;
  const colorStyle = colorMap[assistant.color];
  const knowledgeBadges = assistantKnowledgeBadges[selectedAssistant] || assistantKnowledgeBadges['assistant-rd'];
  const currentMessages = assistantHistories[selectedAssistant] || [buildWelcomeMessage(selectedAssistant)];

  const createMessageId = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateMessage = (
    assistantKey: string,
    messageId: string,
    updater: (message: Message) => Message
  ) => {
    setAssistantHistories((prev) => {
      const messages = prev[assistantKey] || [buildWelcomeMessage(assistantKey)];

      return {
        ...prev,
        [assistantKey]: messages.map((message) =>
          message.id === messageId ? updater(message) : message
        ),
      };
    });
  };

  const hasPendingTrace = (messageId: string) =>
    Boolean(traceProcessingRef.current[messageId]) ||
    (traceQueueRef.current[messageId]?.length ?? 0) > 0;

  const revealBufferedAnswer = (assistantKey: string, messageId: string) => {
    if (hasPendingTrace(messageId)) {
      return;
    }

    updateMessage(assistantKey, messageId, (message) => {
      if (!message.traceDone) {
        return {
          ...message,
          activeTrace: undefined,
          statusText: '正在生成回答...',
        };
      }

      return {
        ...message,
        activeTrace: undefined,
        content: message.bufferedContent || message.content,
        statusText: undefined,
      };
    });

    if (referenceTimersRef.current[messageId]) {
      window.clearTimeout(referenceTimersRef.current[messageId]);
    }

    referenceTimersRef.current[messageId] = window.setTimeout(() => {
      updateMessage(assistantKey, messageId, (message) => ({
        ...message,
        referencesVisible:
          isKnowledgeRoute(message.responseRoute) && Boolean(message.references?.length),
      }));
      delete referenceTimersRef.current[messageId];
    }, 900);
  };

  const processTraceQueue = async (assistantKey: string, messageId: string) => {
    if (traceProcessingRef.current[messageId]) {
      return;
    }

    traceProcessingRef.current[messageId] = true;

    try {
      while ((traceQueueRef.current[messageId]?.length ?? 0) > 0) {
        const step = traceQueueRef.current[messageId].shift();
        if (!step) {
          continue;
        }

        updateMessage(assistantKey, messageId, (message) => ({
          ...message,
          activeTrace: step,
          statusText: getTraceLoadingText(step),
        }));

        await wait(getTraceDelay(step));

        updateMessage(assistantKey, messageId, (message) => ({
          ...message,
          activeTrace: undefined,
          retrievalTrace: mergeTraceSteps(message.retrievalTrace, [step]),
          statusText: step.detail,
        }));
      }
    } finally {
      traceProcessingRef.current[messageId] = false;
      revealBufferedAnswer(assistantKey, messageId);
    }
  };

  const enqueueTraceSteps = (
    assistantKey: string,
    messageId: string,
    incomingSteps: RetrievalStep[] = []
  ) => {
    if (!incomingSteps.length) {
      return;
    }

    const seen = seenTraceStepIdsRef.current[messageId] || new Set<string>();
    seenTraceStepIdsRef.current[messageId] = seen;

    const queue = traceQueueRef.current[messageId] || [];
    traceQueueRef.current[messageId] = queue;

    for (const step of incomingSteps) {
      if (!step?.id || seen.has(step.id)) {
        continue;
      }

      seen.add(step.id);
      queue.push(step);
    }

    void processTraceQueue(assistantKey, messageId);
  };

  const parseSseEvent = (chunk: string) => {
    const lines = chunk.split('\n');
    const eventLine = lines.find((line) => line.startsWith('event:'));
    const dataLine = lines.find((line) => line.startsWith('data:'));
    const eventName = eventLine ? eventLine.replace(/^event:\s*/, '').trim() : 'message';
    const dataText = dataLine ? dataLine.replace(/^data:\s*/, '').trim() : '';

    try {
      return { event: eventName, data: dataText ? JSON.parse(dataText) : null };
    } catch {
      return { event: eventName, data: dataText };
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  useEffect(() => {
    return () => {
      Object.values(referenceTimersRef.current).forEach((timerId) => {
        window.clearTimeout(timerId);
      });
    };
  }, []);

  useEffect(() => {
    setSelectedAssistant(assistantId);
    setIsTyping(false);
    setInputValue('');
    setAssistantHistories((prev) => {
      if (prev[assistantId]?.length) {
        return prev;
      }

      return {
        ...prev,
        [assistantId]: [buildWelcomeMessage(assistantId)],
      };
    });
  }, [assistantId]);

  const handleSelectAssistant = (id: string) => {
    setSelectedAssistant(id);
    setIsTyping(false);
    setInputValue('');
    setAssistantHistories((prev) => {
      if (prev[id]?.length) {
        return prev;
      }

      return {
        ...prev,
        [id]: [buildWelcomeMessage(id)],
      };
    });
  };

  const startNewConversation = () => {
    setAssistantHistories((prev) => ({
      ...prev,
      [selectedAssistant]: [buildWelcomeMessage(selectedAssistant)],
    }));
    setInputValue('');
    setIsTyping(false);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userInput = content.trim();
    const assistantMessageId = createMessageId('assistant');
    const userMessageId = createMessageId('user');

    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setAssistantHistories((prev) => ({
      ...prev,
      [selectedAssistant]: [
        ...(prev[selectedAssistant] || [buildWelcomeMessage(selectedAssistant)]),
        userMessage,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          responseRoute: undefined,
          timestamp: new Date(),
          retrievalTrace: [],
          activeTrace: undefined,
          statusText: undefined,
          bufferedContent: '',
          traceDone: false,
          referencesVisible: false,
        },
      ],
    }));

    traceQueueRef.current[assistantMessageId] = [];
    traceProcessingRef.current[assistantMessageId] = false;
    seenTraceStepIdsRef.current[assistantMessageId] = new Set();
    if (referenceTimersRef.current[assistantMessageId]) {
      window.clearTimeout(referenceTimersRef.current[assistantMessageId]);
      delete referenceTimersRef.current[assistantMessageId];
    }

    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          assistantId: selectedAssistant,
          assistantName: assistant.name,
          history: currentMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        const errorData = contentType.includes('application/json') ? await response.json() : null;
        const errorMessage =
          typeof errorData?.error === 'string' && errorData.error.trim()
            ? errorData.error
            : '抱歉，当前AI服务暂时不可用，请稍后重试。';

        updateMessage(selectedAssistant, assistantMessageId, (message) => ({
          ...message,
          content: errorMessage,
          bufferedContent: errorMessage,
          timestamp: new Date(),
          statusText: undefined,
          traceDone: true,
          referencesVisible: false,
        }));
        return;
      }

      if (contentType.includes('text/event-stream')) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let streamedContent = '';

        if (!reader) {
          throw new Error('流式响应不可用');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          for (const rawEvent of events) {
            if (!rawEvent.trim() || rawEvent.includes('data: [DONE]')) {
              continue;
            }

            const parsed = parseSseEvent(rawEvent);

            if (parsed.event === 'meta' && parsed.data) {
              if (
                parsed.data.responseRoute === 'knowledge' &&
                Array.isArray(parsed.data.retrievalTrace)
              ) {
                enqueueTraceSteps(selectedAssistant, assistantMessageId, parsed.data.retrievalTrace);
              }

              updateMessage(selectedAssistant, assistantMessageId, (message) => ({
                ...message,
                timestamp: new Date(),
                responseRoute:
                  parsed.data.responseRoute === 'knowledge' || parsed.data.responseRoute === 'direct'
                    ? parsed.data.responseRoute
                    : message.responseRoute,
                statusText:
                  parsed.data.responseRoute === 'knowledge' &&
                  typeof parsed.data.statusText === 'string'
                    ? parsed.data.statusText
                    : message.statusText,
                references: Array.isArray(parsed.data.references)
                  ? parsed.data.references
                  : message.references,
                answerMode:
                  parsed.data.answerMode === 'fallback' || parsed.data.answerMode === 'model'
                    ? parsed.data.answerMode
                    : message.answerMode,
              }));
            }

            if (parsed.event === 'trace' && parsed.data?.step) {
              enqueueTraceSteps(selectedAssistant, assistantMessageId, [parsed.data.step]);
            }

            if (parsed.event === 'error' && typeof parsed.data?.message === 'string') {
              updateMessage(selectedAssistant, assistantMessageId, (message) => ({
                ...message,
                content: parsed.data.message,
                bufferedContent: parsed.data.message,
                timestamp: new Date(),
                statusText: undefined,
                traceDone: true,
                referencesVisible: false,
              }));
            }

            if (parsed.event === 'delta' && parsed.data?.content) {
              streamedContent += String(parsed.data.content);
              updateMessage(selectedAssistant, assistantMessageId, (message) => ({
                ...message,
                content: isKnowledgeRoute(message.responseRoute) ? message.content : streamedContent,
                bufferedContent: streamedContent,
                timestamp: new Date(),
                statusText: isKnowledgeRoute(message.responseRoute)
                  ? message.statusText || '正在生成回答...'
                  : undefined,
              }));
            }

            if (parsed.event === 'done' && parsed.data) {
              if (
                parsed.data.responseRoute === 'knowledge' &&
                Array.isArray(parsed.data.retrievalTrace)
              ) {
                enqueueTraceSteps(selectedAssistant, assistantMessageId, parsed.data.retrievalTrace);
              }

              streamedContent =
                typeof parsed.data.answer === 'string' ? parsed.data.answer : streamedContent;

              updateMessage(selectedAssistant, assistantMessageId, (message) => {
                const nextRoute =
                  parsed.data.responseRoute === 'knowledge' || parsed.data.responseRoute === 'direct'
                    ? parsed.data.responseRoute
                    : message.responseRoute;
                const knowledgeMode = isKnowledgeRoute(nextRoute);

                return {
                  ...message,
                  content: knowledgeMode ? message.content : streamedContent,
                  bufferedContent: streamedContent,
                  timestamp: new Date(),
                  responseRoute: nextRoute,
                  references: Array.isArray(parsed.data.references)
                    ? parsed.data.references
                    : message.references,
                  answerMode:
                    parsed.data.answerMode === 'fallback' || parsed.data.answerMode === 'model'
                      ? parsed.data.answerMode
                      : message.answerMode,
                  traceDone: true,
                  statusText:
                    knowledgeMode && hasPendingTrace(assistantMessageId)
                      ? '正在生成回答...'
                      : undefined,
                  referencesVisible: false,
                };
              });

              if (parsed.data.responseRoute === 'knowledge') {
                revealBufferedAnswer(selectedAssistant, assistantMessageId);
              }
            }
          }
        }

        if (buffer.trim()) {
          const parsed = parseSseEvent(buffer);
          if (parsed.event === 'delta' && parsed.data?.content) {
            streamedContent += String(parsed.data.content);
          }

          updateMessage(selectedAssistant, assistantMessageId, (message) => ({
            ...message,
            bufferedContent: streamedContent || message.bufferedContent,
            timestamp: new Date(),
          }));
        }

        return;
      }

      const result = await response.json();
      const finalAnswer =
        typeof result?.data?.answer === 'string' && result.data.answer.trim()
          ? result.data.answer
          : '抱歉，当前AI服务暂时不可用，请稍后重试。';
      const responseRoute: ResponseRoute | undefined =
        result?.data?.responseRoute === 'knowledge' || result?.data?.responseRoute === 'direct'
          ? result.data.responseRoute
          : undefined;

      if (responseRoute === 'knowledge' && Array.isArray(result?.data?.retrievalTrace)) {
        enqueueTraceSteps(selectedAssistant, assistantMessageId, result.data.retrievalTrace);
      }

      updateMessage(selectedAssistant, assistantMessageId, (message) => ({
        ...message,
        content: isKnowledgeRoute(responseRoute || message.responseRoute) ? '' : finalAnswer,
        bufferedContent: finalAnswer,
        timestamp: new Date(),
        responseRoute: responseRoute || message.responseRoute,
        references: Array.isArray(result?.data?.references) ? result.data.references : message.references,
        answerMode:
          result?.data?.answerMode === 'fallback' || result?.data?.answerMode === 'model'
            ? result.data.answerMode
            : message.answerMode,
        traceDone: true,
        statusText:
          isKnowledgeRoute(responseRoute || message.responseRoute) && hasPendingTrace(assistantMessageId)
            ? '正在生成回答...'
            : undefined,
        referencesVisible: false,
      }));

      if (responseRoute === 'knowledge') {
        revealBufferedAnswer(selectedAssistant, assistantMessageId);
      }
    } catch (error) {
      console.error('发送消息失败:', error);

      updateMessage(selectedAssistant, assistantMessageId, (message) => ({
        ...message,
        content: '抱歉，当前AI服务暂时不可用，请稍后再试。',
        bufferedContent: '抱歉，当前AI服务暂时不可用，请稍后再试。',
        timestamp: new Date(),
        statusText: undefined,
        traceDone: true,
        referencesVisible: false,
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleGoHome = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }

    // Fallback: ensure `app/page.tsx` internal state resets.
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, [onBack]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
      <div
        className={cn(
          'bg-white/90 dark:bg-gray-900/90 border-r border-gray-200 dark:border-gray-800 flex flex-col min-h-0 backdrop-blur transition-[width] duration-200 ease-linear',
          sidebarExpanded ? 'w-80' : 'w-20'
        )}
      >
        
        
      <div className="h-[81px] cursor-pointer p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleGoHome}
          className={cn(
            'flex items-center rounded-xl py-1.5 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600',
            sidebarExpanded ? 'gap-3 px-2' : 'gap-0 px-1',
            'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60'
          )}
          aria-label="返回首页"
          title="返回首页"
        >
          <Image
            src={FullLogo}
            alt="FUTUREWAY"
            width={40}
            height={40}
            className={cn('h-8 w-[100px]', sidebarExpanded ? '' : 'h-8 max-w-[44px]')}
            priority
          />

          {sidebarExpanded && (
            <div className="leading-tight">
              <h3 className="font-semibold text-md text-white">
                智能知识管理系统
              </h3>
            </div>
          )} 
        </button>

              
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => setSidebarExpanded((v) => !v)}
          className="ml-4 h-9 w-9 cursor-pointer"
          aria-label={sidebarExpanded ? '折叠侧边栏' : '展开侧边栏'}
          title={sidebarExpanded ? '折叠侧边栏' : '展开侧边栏'}
        >
          {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

<div className={cn('p-4 border-b border-gray-200 dark:border-gray-800', sidebarExpanded ? '' : 'hidden')}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
            <svg 
  viewBox="0 0 16 16" 
  className="w-8 h-8 transition-transform hover:scale-110" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
>
  <path 
    d="M8 0L10.16 5.84L16 8L10.16 10.16L8 16L5.84 10.16L0 8L5.84 5.84L8 0Z" 
    fill="url(#star-gradient)" 
  />
  <defs>
    <linearGradient id="star-gradient" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse">
      <stop stopColor="#BF2BE8" />
      <stop offset="1" stopColor="#FFD6AB" />
    </linearGradient>
  </defs>
</svg>
              {/* <i data-v-3905c506="" className="el-icon scene-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"><path id="Star 1" d="M8 0L10.1607 5.83927L16 8L10.1607 10.1607L8 16L5.83927 10.1607L0 8L5.83927 5.83927L8 0Z" fill="url(#paint0_linear_284_140)"></path><defs><linearGradient id="paint0_linear_284_140" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse"><stop stop-color="var(--color-lg-from,rgb(191, 43, 232))"></stop><stop offset="1" stop-color="var(--color-lg-to, #FFD6AB)"></stop></linearGradient></defs></svg></i> */}
              <div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">AI问答助手</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  按问题类型智能路由回答
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={startNewConversation} className="h-8 px-2">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              新对话
            </Button>
            
          </div>
        </div>

        <div
          className={cn(
            'p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-center',
            sidebarExpanded ? 'hidden' : ''
          )}
        >
          <Button variant="outline" size="icon" onClick={startNewConversation} aria-label="新对话">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        

        <ScrollArea className={cn('flex-1 min-h-0', sidebarExpanded ? 'p-3' : 'p-2')}>
          <div className={cn('space-y-2', sidebarExpanded ? '' : 'flex flex-col items-center')}>
            {aiAssistants.map((asst) => {
              const style = colorMap[asst.color];

              return (
                <motion.button
                  key={asst.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectAssistant(asst.id)}
                  className={cn(
                    'w-full rounded-xl transition-all border-2',
                    sidebarExpanded ? 'p-3 text-left' : 'p-2',
                    selectedAssistant === asst.id
                      ? `border-transparent bg-gradient-to-r ${style.gradient} text-white shadow-lg`
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                  )}
                >
                  <div className={cn('flex items-center gap-3', sidebarExpanded ? '' : 'justify-center gap-0')}>
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                        selectedAssistant === asst.id ? 'bg-white/20' : style.bg
                      )}
                    >
                      {asst.avatar}
                    </div>
                    {sidebarExpanded && (
                      <div className="flex-1 min-w-0">
                      <h3
                        className={cn(
                          'font-semibold text-sm truncate',
                          selectedAssistant === asst.id
                            ? 'text-white'
                            : 'text-gray-900 dark:text-white'
                        )}
                      >
                        {asst.name}
                      </h3>
                      <p
                        className={cn(
                          'text-xs truncate',
                          selectedAssistant === asst.id
                            ? 'text-white/80'
                            : 'text-gray-500 dark:text-gray-400'
                        )}
                      >
                        {asst.department}
                      </p>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div
          className={cn(
            'px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r',
            colorStyle.gradient
          )}
        >
          <div className="flex items-center gap-3">
            <div className="ml-8 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
              {assistant.avatar}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{assistant.name}</h2>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <span>{assistant.department}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  在线
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {knowledgeBadges.map((badge) => (
                <Badge key={badge} variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence mode="popLayout">
              {currentMessages.map((message) => {
                const showTraceCard =
                  message.role === 'assistant' &&
                  isKnowledgeRoute(message.responseRoute) &&
                  !message.content &&
                  ((message.retrievalTrace && message.retrievalTrace.length > 0) ||
                    !!message.activeTrace ||
                    !!message.statusText);
                const compactTraceSteps = (message.retrievalTrace || []).slice(-3);

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn('flex gap-3', message.role === 'user' ? 'flex-row-reverse' : '')}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                        message.role === 'user'
                          ? 'bg-gray-200 dark:bg-gray-800'
                          : `bg-gradient-to-r ${colorStyle.gradient} text-white`
                      )}
                    >
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      ) : (
                        assistant.avatar
                      )}
                    </div>

                    <div className={cn('max-w-[84%] space-y-3', message.role === 'user' ? 'text-right' : '')}>
                      {showTraceCard && (
                        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/85 px-4 py-3 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900/75">
                          <div className="flex items-center gap-2">
                            <LoaderCircle className="w-4 h-4 animate-spin text-slate-500 dark:text-slate-300" />
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">思考中</p>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {message.statusText || '正在整理关键信息'}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            {compactTraceSteps.map((step) => (
                              <div key={step.id} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                    {step.title}
                                  </p>
                                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    {step.detail}
                                  </p>
                                </div>
                              </div>
                            ))}

                            {message.activeTrace && (
                              <div className="flex items-start gap-2">
                                <LoaderCircle className="mt-0.5 h-3.5 w-3.5 animate-spin text-blue-500" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                                    {message.activeTrace.title}
                                  </p>
                                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    {getTraceLoadingText(message.activeTrace)}
                                  </p>
                                </div>
                              </div>
                            )}

                            {!message.activeTrace && message.statusText && (
                              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                {message.statusText}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {message.role === 'assistant' &&
                        message.responseRoute === 'direct' &&
                        !message.content &&
                        !message.traceDone && (
                        <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-left shadow-sm dark:border-gray-800 dark:bg-gray-900">
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            <span className="text-sm">正在生成回答...</span>
                          </div>
                        </div>
                      )}

                      {(message.content || message.role === 'user') && (
                        <div
                          className={cn(
                            'rounded-2xl p-4',
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              : 'bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800'
                          )}
                        >
                          {message.role === 'assistant' &&
                            message.content &&
                            isKnowledgeRoute(message.responseRoute) && (
                            <div className="flex items-center gap-2 mb-3">
                              <Badge
                                variant="secondary"
                                className="border-0 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200"
                              >
                                企业知识回答
                              </Badge>
                            </div>
                          )}

                          {renderMessageContent(message.content, message.role)}
                        </div>
                      )}

                      {message.role === 'assistant' &&
                        message.content &&
                        message.referencesVisible &&
                        isKnowledgeRoute(message.responseRoute) &&
                        message.references &&
                        message.references.length > 0 && (
                        <div className="px-1 pt-1 text-left">
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] font-medium tracking-wide text-gray-400 dark:text-gray-500">
                              依据文档
                            </p>
                            <span className="text-[11px] text-gray-400 dark:text-gray-500">
                              {message.references.length}份
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.references.slice(0, 3).map((reference) => (
                              <div
                                key={reference.id}
                                className="rounded-full border border-gray-200/80 bg-gray-50/70 px-3 py-1.5 dark:border-gray-800 dark:bg-slate-950/50"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                  <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                                    {reference.title}
                                  </span>
                                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                    {reference.repository}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {message.references.length > 3 && (
                              <span className="self-center text-[11px] text-gray-400 dark:text-gray-500">
                                另有 {message.references.length - 3} 份资料
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {message.role === 'assistant' && message.content && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString('zh-CN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                            <ThumbsUp className="w-4 h-4 text-gray-400 hover:text-green-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                            <ThumbsDown className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                          >
                            <Copy className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isTyping &&
              !currentMessages.some((message) => message.role === 'assistant' && !message.content.trim()) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r',
                      colorStyle.gradient
                    )}
                  >
                    {assistant.avatar}
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {currentMessages.length === 1 && (
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                试试这些贴近业务的演示问题
              </p>
              <div className="flex flex-wrap gap-2">
                {assistant.quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </Button>
              </div>
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="输入业务问题，系统会按企业知识链路逐步检索..."
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage(inputValue);
                    }
                  }}
                  className="pr-12 h-11"
                />
                <Button variant="ghost" size="sm" className="absolute right-1 top-1 h-9 w-9 p-0">
                  <Mic className="w-5 h-5 text-gray-400" />
                </Button>
              </div>
              <Button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className={cn('h-11 px-6 bg-gradient-to-r', colorStyle.gradient)}
              >
                <Send className="w-5 h-5 mr-2" />
                发送
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              回答优先引用企业知识库、规范库和历史案例
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
