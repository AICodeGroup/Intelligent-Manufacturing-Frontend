'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Bot, 
  Home,
  MessageSquare,
  User,
  Zap,
  Microscope,
  Factory,
  TrendingUp,
  Headphones,
  Users,
  Package,
  Settings,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { aiAssistantData } from '@/lib/products-data-new';
import { useState } from 'react';

export default function AIAssistantCenterPage() {
  const [activeTab, setActiveTab] = useState<'common' | 'departments' | 'backend'>('common');

  const tabs = [
    { id: 'common' as const, label: '通用基础功能', icon: Sparkles, description: '所有部门助手共用的核心功能' },
    { id: 'departments' as const, label: '部门专属功能', icon: Bot, description: '6大核心部门差异化定制功能' },
    { id: 'backend' as const, label: '后台管理功能', icon: Settings, description: '助手中心总管理与配置' }
  ];

  const iconMap: Record<string, any> = {
    'assistant-workspace': Home,
    'assistant-qa': MessageSquare,
    'assistant-personal': User,
    'assistant-tools': Zap,
    'assistant-manage': Settings,
    'assistant-customize': Bot,
    'assistant-cross': ArrowRight,
    'assistant-compliance': CheckCircle2,
    'assistant-analytics': TrendingUp,
  };

  const departmentIconMap: Record<string, any> = {
    'assistant-rd': Microscope,
    'assistant-production': Factory,
    'assistant-marketing': TrendingUp,
    'assistant-service': Headphones,
    'assistant-hr': Users,
    'assistant-procurement': Package,
  };

  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
    cyan: 'from-cyan-500 to-blue-500',
    amber: 'from-amber-500 to-orange-500',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{aiAssistantData.name}</h1>
              <p className="text-orange-100 mt-1">{aiAssistantData.description}</p>
            </div>
          </div>

          {/* 6大部门助手展示 */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-orange-200" />
              <span className="text-sm font-medium text-orange-100">6大部门AI问答助手</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {aiAssistantData.departmentAssistants.map((dept, i) => {
                const Icon = departmentIconMap[dept.id] || Bot;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      'bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/20 transition-all cursor-pointer'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center',
                      `bg-gradient-to-r ${colorMap[dept.color]}`
                    )}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-semibold text-sm">{dept.name.replace('AI', '').replace('问答助手', '')}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{aiAssistantData.commonFeatures.length}</div>
              <div className="text-sm text-orange-100">通用功能模块</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{aiAssistantData.departmentAssistants.length}</div>
              <div className="text-sm text-orange-100">部门助手</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{aiAssistantData.backendModules.length}</div>
              <div className="text-sm text-orange-100">后台模块</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">
                {aiAssistantData.commonFeatures.reduce((sum, f) => sum + f.features.length, 0)}
              </div>
              <div className="text-sm text-orange-100">通用功能点</div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tab 切换 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'p-6 rounded-2xl border-2 transition-all text-left',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-xl'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    activeTab === tab.id ? 'bg-white/20' : 'bg-orange-100 dark:bg-orange-900/30'
                  )}>
                    <Icon className={cn(
                      'w-5 h-5',
                      activeTab === tab.id ? 'text-white' : 'text-orange-600 dark:text-orange-400'
                    )} />
                  </div>
                  <span className={cn(
                    'font-bold text-base',
                    activeTab === tab.id ? 'text-white' : 'text-gray-900 dark:text-white'
                  )}>
                    {tab.label}
                  </span>
                </div>
                <p className={cn(
                  'text-sm',
                  activeTab === tab.id ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {tab.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* 通用功能 */}
        {activeTab === 'common' && (
          <div className="space-y-6">
            {aiAssistantData.commonFeatures.map((module, index) => {
              const Icon = iconMap[module.id] || Bot;
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* 模块头部 */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {module.name}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {module.features.length} 个功能点
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 功能列表 */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {module.features.map((feature, fIndex) => (
                        <motion.div
                          key={fIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.1 + fIndex * 0.05 }}
                          className="group"
                        >
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-900/20 dark:hover:to-red-900/20 transition-all border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-md">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-500" />
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                  {feature.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 部门专属功能 */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            {aiAssistantData.departmentAssistants.map((dept, index) => {
              const Icon = departmentIconMap[dept.id] || Bot;
              
              return (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* 部门头部 */}
                  <div className={cn(
                    'p-6 border-b border-gray-100 dark:border-gray-700',
                    `bg-gradient-to-r ${colorMap[dept.color].replace('from-', 'from-').replace('to-', 'to-')}`
                  )} style={{
                    background: `linear-gradient(to right, var(--tw-gradient-stops))`
                  }}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">{dept.name}</h3>
                        <p className="text-white/80">{dept.department}</p>
                      </div>
                      <div className="flex gap-2">
                        {dept.plugins.slice(0, 3).map((plugin, i) => (
                          <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                            {plugin.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* 快捷提问 */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-500" />
                        快捷提问
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {dept.quickQuestions.map((q, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 cursor-pointer transition-all"
                          >
                            {q}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 场景插件 */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Bot className="w-4 h-4 text-purple-500" />
                        场景插件
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {dept.plugins.map((plugin, i) => (
                          <div 
                            key={i} 
                            className="p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                          >
                            <div className="font-medium text-gray-900 dark:text-white mb-1">{plugin.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{plugin.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 专属能力 */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        专属能力
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {dept.capabilities.map((cap, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg text-sm text-orange-700 dark:text-orange-300"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 后台管理功能 */}
        {activeTab === 'backend' && (
          <div className="space-y-6">
            {aiAssistantData.backendModules.map((module, index) => {
              const Icon = iconMap[module.id] || Settings;
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* 模块头部 */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-r from-gray-600 to-slate-600 text-white">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {module.name}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {module.features.length} 个功能点
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 功能列表 */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {module.features.map((feature, fIndex) => (
                        <motion.div
                          key={fIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.1 + fIndex * 0.05 }}
                          className="group"
                        >
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-700 dark:hover:to-slate-700 transition-all border border-gray-100 dark:border-gray-700 hover:shadow-md">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-500" />
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">
                                  {feature.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 底部说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-100 dark:border-orange-800"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                双底座赋能，场景化应用
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                多部门AI问答助手中心基于企业知识库和知识图谱双底座赋能，为研发、生产、营销、客服、人力、采购六大核心部门
                提供场景化专属助手，前端极简交互聚焦问答，后台全面管控支持定制化配置，实现知识统一管理、数据关联挖掘、场景化智能问答。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
