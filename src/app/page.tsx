'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Bot, 
  Settings, 
  Network,
  Eye,
  Volume2,
  Users,
  BarChart3,
  ChevronRight,
  Sparkles,
  BookOpen,
  MessageSquare,
  Layers,
  Zap,
  ArrowRight
} from 'lucide-react';
import KnowledgePortal from '@/components/KnowledgePortal';
import AIAssistantChat from '@/components/AIAssistantChat';
import KnowledgeConfigPanel from '@/components/KnowledgeConfigPanel';
import { Button } from '@/components/ui/button';

type PageType = 'home' | 'knowledge' | 'assistant' | 'config' | 'graph' | 'vision' | 'acoustic' | 'behavior' | 'scheduling';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedAssistant, setSelectedAssistant] = useState<string>('assistant-production');

  // 导航菜单
  const mainNav = [
    { id: 'knowledge' as PageType, name: '企业知识库', icon: Database, color: 'blue', desc: '知识检索与管理' },
    { id: 'assistant' as PageType, name: 'AI问答助手', icon: Bot, color: 'purple', desc: '6大部门助手' },
    { id: 'config' as PageType, name: '后台配置', icon: Settings, color: 'green', desc: '系统管理' },
  ];

  const otherNav = [
    { id: 'graph' as PageType, name: '知识图谱', icon: Network, color: 'cyan' },
    { id: 'vision' as PageType, name: 'AI视觉质检', icon: Eye, color: 'emerald' },
    { id: 'acoustic' as PageType, name: 'AI声学质检', icon: Volume2, color: 'violet' },
    { id: 'behavior' as PageType, name: 'AI行为识别', icon: Users, color: 'rose' },
    { id: 'scheduling' as PageType, name: 'AI智能排产', icon: BarChart3, color: 'indigo' },
  ];

  const colorMap: Record<string, { bg: string; gradient: string }> = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', gradient: 'from-blue-500 to-cyan-500' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', gradient: 'from-purple-500 to-pink-500' },
    green: { bg: 'bg-green-100 dark:bg-green-900/30', gradient: 'from-green-500 to-emerald-500' },
    cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', gradient: 'from-cyan-500 to-blue-500' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', gradient: 'from-emerald-500 to-teal-500' },
    violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', gradient: 'from-violet-500 to-purple-500' },
    rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', gradient: 'from-rose-500 to-pink-500' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', gradient: 'from-indigo-500 to-blue-500' },
  };

  // 处理从知识库打开助手
  const handleOpenAssistant = (assistantId: string) => {
    setSelectedAssistant(assistantId);
    setCurrentPage('assistant');
  };

  // 主页
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-full blur-3xl" />
          
          <div className="relative max-w-6xl mx-auto px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium mb-6 shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>未来未科技 · 智能知识管理系统</span>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                知识图谱 / 企业知识库 / 多部门AI问答助手
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                面向制造企业打造「双底座 + 多场景」智能知识管理体系，赋能各部门AI问答助手场景化应用
              </p>
            </motion.div>

            {/* 核心功能入口 */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              {mainNav.map((nav, index) => {
                const Icon = nav.icon;
                const style = colorMap[nav.color];
                return (
                  <motion.button
                    key={nav.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => setCurrentPage(nav.id)}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-left group hover:shadow-2xl transition-all"
                  >
                    <div className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center mb-6',
                      `bg-gradient-to-r ${style.gradient}`
                    )}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {nav.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{nav.desc}</p>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                      <span>进入体验</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* 产品矩阵 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Layers className="w-6 h-6 text-purple-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">产品矩阵</h2>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {otherNav.map((nav, index) => {
                  const Icon = nav.icon;
                  const style = colorMap[nav.color];
                  return (
                    <motion.button
                      key={nav.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setCurrentPage(nav.id)}
                      className="p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all text-left"
                    >
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
                        style.bg
                      )}>
                        <Icon className={cn('w-6 h-6', `text-${nav.color}-500`)} />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{nav.name}</h4>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 流程说明 */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                体验流程
              </h3>
              <div className="flex items-center justify-between">
                {[
                  { step: 1, title: '知识入库', desc: '后台配置知识', icon: BookOpen },
                  { step: 2, title: '知识检索', desc: '员工搜索知识', icon: Database },
                  { step: 3, title: 'AI问答', desc: '助手智能解答', icon: MessageSquare },
                  { step: 4, title: '数据分析', desc: '效果统计优化', icon: BarChart3 },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center">
                      <div className="text-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                          {item.step}
                        </div>
                        <Icon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                      {i < 3 && (
                        <ChevronRight className="w-6 h-6 text-gray-300 mx-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 知识库页面
  if (currentPage === 'knowledge') {
    return (
      <div className="relative">
        {/* 返回按钮 */}
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            onClick={() => setCurrentPage('home')}
            className="bg-white dark:bg-gray-800 shadow-lg"
          >
            ← 返回主页
          </Button>
        </div>
        <KnowledgePortal onOpenAssistant={handleOpenAssistant} />
      </div>
    );
  }

  // AI助手页面
  if (currentPage === 'assistant') {
    return (
      <div className="relative">
        {/* 返回按钮 */}
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            onClick={() => setCurrentPage('home')}
            className="bg-white dark:bg-gray-800 shadow-lg"
          >
            ← 返回主页
          </Button>
        </div>
        <AIAssistantChat assistantId={selectedAssistant} />
      </div>
    );
  }

  // 后台配置页面
  if (currentPage === 'config') {
    return (
      <div className="relative">
        {/* 返回按钮 */}
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            onClick={() => setCurrentPage('home')}
            className="bg-white dark:bg-gray-800 shadow-lg"
          >
            ← 返回主页
          </Button>
        </div>
        <KnowledgeConfigPanel />
      </div>
    );
  }

  // 其他产品页面（静态展示）
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* 返回按钮 */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          onClick={() => setCurrentPage('home')}
          className="bg-white dark:bg-gray-800 shadow-lg"
        >
          ← 返回主页
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {(() => {
            const nav = [...mainNav, ...otherNav].find(n => n.id === currentPage);
            if (!nav) return null;
            const Icon = nav.icon;
            const style = colorMap[nav.color];
            
            return (
              <>
                <div className={cn(
                  'w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8',
                  `bg-gradient-to-r ${style.gradient}`
                )}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {nav.name}
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
                  产品功能模块正在开发中...
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">核心功能</h4>
                      <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                        <li>• 智能数据处理</li>
                        <li>• 实时分析预警</li>
                        <li>• 可视化报表</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">应用场景</h4>
                      <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                        <li>• 生产制造</li>
                        <li>• 质量管控</li>
                        <li>• 设备管理</li>
                      </ul>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500">
                    预约体验
                  </Button>
                </div>
              </>
            );
          })()}
        </motion.div>
      </div>
    </div>
  );
}
