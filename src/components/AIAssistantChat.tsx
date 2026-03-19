'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Paperclip,
  Bot,
  User,
  Sparkles,
  ChevronLeft,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Copy
} from 'lucide-react';
import { aiAssistants, aiResponses } from '@/lib/demo-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIAssistantChatProps {
  assistantId?: string;
  onBack?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  references?: { id: string; title: string }[];
}

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
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', gradient: 'from-green-500 to-emerald-500' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', gradient: 'from-purple-500 to-pink-500' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', gradient: 'from-orange-500 to-red-500' },
  cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400', gradient: 'from-cyan-500 to-blue-500' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', gradient: 'from-amber-500 to-orange-500' },
};

export default function AIAssistantChat({ assistantId = 'assistant-production', onBack }: AIAssistantChatProps) {
  const [selectedAssistant, setSelectedAssistant] = useState(assistantId);
  const [assistantHistories, setAssistantHistories] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(2);

  const assistant = aiAssistants.find(a => a.id === selectedAssistant)!;
  const colorStyle = colorMap[assistant.color];
  const currentMessages = assistantHistories[selectedAssistant] || [buildWelcomeMessage(selectedAssistant)];

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

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

  // 发送消息
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    const userInput = content.trim();

    // 添加用户消息
    const userMessage: Message = {
      id: String(nextIdRef.current++),
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };
    setAssistantHistories((prev) => ({
      ...prev,
      [selectedAssistant]: [...(prev[selectedAssistant] || [buildWelcomeMessage(selectedAssistant)]), userMessage],
    }));
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
          history: currentMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const result = await response.json();

      const answer =
        response.ok && result?.success
          ? result?.data?.answer
          : undefined;

      const errorMessage =
        typeof result?.error === 'string' && result.error.trim()
          ? result.error
          : undefined;

      const finalContent =
        typeof answer === 'string' && answer.trim()
          ? answer
          : errorMessage || '抱歉，当前AI服务暂时不可用，请稍后重试。';
      const assistantMessage: Message = {
        id: String(nextIdRef.current++),
        role: 'assistant',
        content: finalContent,
        timestamp: new Date(),
        references: [{ id: 'kb-001', title: '相关文档' }],
      };
      setAssistantHistories((prev) => ({
        ...prev,
        [selectedAssistant]: [...(prev[selectedAssistant] || [buildWelcomeMessage(selectedAssistant)]), assistantMessage],
      }));
    } catch (error) {
      console.error('发送消息失败:', error);

      const assistantMessage: Message = {
        id: String(nextIdRef.current++),
        role: 'assistant',
        content: '抱歉，当前AI服务暂时不可用，请稍后再试。',
        timestamp: new Date(),
      };
      setAssistantHistories((prev) => ({
        ...prev,
        [selectedAssistant]: [...(prev[selectedAssistant] || [buildWelcomeMessage(selectedAssistant)]), assistantMessage],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  // 处理快捷问题
  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  // 复制消息
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* 左侧助手列表 */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
        {/* 标题 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-500" />
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">AI问答助手</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={startNewConversation}
              className="h-8 px-2"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              新对话
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">选择助手开始对话</p>
        </div>

        {/* 助手列表 */}
        <ScrollArea className="flex-1 min-h-0 p-3">
          <div className="space-y-2">
            {aiAssistants.map((asst) => {
              const style = colorMap[asst.color];
              return (
                <motion.button
                  key={asst.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectAssistant(asst.id)}
                  className={cn(
                    'w-full p-3 rounded-xl text-left transition-all border-2',
                    selectedAssistant === asst.id
                      ? `border-transparent bg-gradient-to-r ${style.gradient} text-white shadow-lg`
                      : 'bg-white dark:bg-gray-700 border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                      selectedAssistant === asst.id
                        ? 'bg-white/20'
                        : style.bg
                    )}>
                      {asst.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        'font-semibold text-sm truncate',
                        selectedAssistant === asst.id ? 'text-white' : 'text-gray-900 dark:text-white'
                      )}>
                        {asst.name}
                      </h3>
                      <p className={cn(
                        'text-xs truncate',
                        selectedAssistant === asst.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                      )}>
                        {asst.department}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* 右侧对话区 */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* 对话头部 */}
        <div className={cn(
          'px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r',
          colorStyle.gradient
        )}>
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
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
            <div className="flex gap-2">
              {assistant.capabilities.slice(0, 3).map((cap, i) => (
                <Badge key={i} variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  {cap}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* 消息列表 */}
        <ScrollArea className="flex-1 min-h-0 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence mode="popLayout">
              {currentMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  )}
                >
                  {/* 头像 */}
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user'
                      ? 'bg-gray-200 dark:bg-gray-700'
                      : `bg-gradient-to-r ${colorStyle.gradient} text-white`
                  )}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    ) : (
                      assistant.avatar
                    )}
                  </div>

                  {/* 消息内容 */}
                  <div className={cn(
                    'max-w-[80%]',
                    message.role === 'user' ? 'text-right' : ''
                  )}>
                    <div className={cn(
                      'rounded-2xl p-4',
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700'
                    )}>
                      <div className={cn(
                        'text-sm leading-relaxed whitespace-pre-line',
                        message.role === 'user' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                      )}>
                        {message.content}
                      </div>
                    </div>

                    {/* 消息操作 */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">
                          {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                          <ThumbsUp className="w-4 h-4 text-gray-400 hover:text-green-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                          <ThumbsDown className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                        <button 
                          onClick={() => copyMessage(message.content)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* 打字中状态 */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r',
                  colorStyle.gradient
                )}>
                  {assistant.avatar}
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
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

        {/* 快捷问题 */}
        {currentMessages.length === 1 && (
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                试试这些问题
              </p>
              <div className="flex flex-wrap gap-2">
                {assistant.quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3 py-1.5 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 输入区 */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-3xl mx-auto">
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
                  placeholder="输入您的问题..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(inputValue);
                    }
                  }}
                  className="pr-12 h-11"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-9 w-9 p-0"
                >
                  <Mic className="w-5 h-5 text-gray-400" />
                </Button>
              </div>
              <Button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className={cn(
                  'h-11 px-6 bg-gradient-to-r',
                  colorStyle.gradient
                )}
              >
                <Send className="w-5 h-5 mr-2" />
                发送
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              AI助手基于企业知识库回答 · 答案仅供参考
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
