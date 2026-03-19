'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Network, 
  Bot, 
  Settings,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
  Users,
  Building2,
  Workflow
} from 'lucide-react';
import { 
  knowledgeBaseData, 
  knowledgeGraphData, 
  aiAssistantData, 
  systemManagementData 
} from '@/lib/products-data-new';

interface KnowledgeSystemPageProps {
  onModuleClick: (moduleId: string) => void;
}

export default function KnowledgeSystemPage({ onModuleClick }: KnowledgeSystemPageProps) {
  const coreFeatures = [
    {
      icon: Database,
      title: '双底座架构',
      description: '知识图谱 + 企业知识库双底座，实现数据关联挖掘与知识全生命周期管理'
    },
    {
      icon: Bot,
      title: '多场景应用',
      description: '6大部门AI问答助手，覆盖研发、生产、营销、客服、人力、采购核心场景'
    },
    {
      icon: Users,
      title: '前后端分离',
      description: '前端聚焦使用交互，后台全面管控，前后端数据实时联动'
    },
    {
      icon: Building2,
      title: '制造行业适配',
      description: '深度适配制造业场景，支持工艺参数、设备管理、生产排产等专业需求'
    }
  ];

  const modules = [
    { 
      id: 'knowledge-base', 
      data: knowledgeBaseData, 
      icon: Database,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
    },
    { 
      id: 'knowledge-graph', 
      data: knowledgeGraphData, 
      icon: Network,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    },
    { 
      id: 'ai-assistant-center', 
      data: aiAssistantData, 
      icon: Bot,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
    },
    { 
      id: 'system-management', 
      data: systemManagementData, 
      icon: Settings,
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero 区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium mb-6 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>未来未科技 · 智能知识管理系统</span>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              知识图谱 / 企业知识库 / 多部门AI问答助手
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              面向制造企业打造「双底座 + 多场景」智能知识管理体系，以知识图谱为数据关联挖掘底座、
              企业知识库为多模态知识全生命周期管理底座，赋能各部门AI问答助手场景化应用
            </p>
          </motion.div>

          {/* 核心特性 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 架构图 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Layers className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">系统架构</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 应用层 */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-orange-900 dark:text-orange-300">应用层</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">多部门AI问答助手</h3>
                  <div className="space-y-2">
                    {['研发选型助手', '生产工艺助手', '营销问答助手', '客服坐席助手', '人力行政助手', '采购供应链助手'].map((name, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-orange-500" />
                        <span>{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 双底座 */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {/* 知识图谱 */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                        <Network className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-purple-900 dark:text-purple-300">数据底座</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">知识图谱平台</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      数据关联挖掘 + 智能决策底座
                    </p>
                    <div className="space-y-1.5">
                      {['异构数据整合', '图谱构建与管理', '关联路径挖掘', '智能决策支撑'].map((name, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 企业知识库 */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
                        <Database className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-blue-900 dark:text-blue-300">知识底座</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">企业知识库</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      多模态知识全生命周期管理底座
                    </p>
                    <div className="space-y-1.5">
                      {['多模态知识接入', '知识处理与萃取', '知识域管理', '合规与安全'].map((name, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 四大模块入口 */}
          <div className="flex items-center gap-3 mb-6">
            <Workflow className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">功能模块</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon;
              const data = module.data;
              const totalFeatures = 'modules' in data 
                ? (data as any).modules.reduce((sum: number, m: any) => sum + m.features.length, 0)
                : 'departmentAssistants' in data
                  ? (data as any).commonFeatures.reduce((sum: number, f: any) => sum + f.features.length, 0) +
                    (data as any).departmentAssistants.length
                  : 0;
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 4) }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => onModuleClick(module.id)}
                  className={cn(
                    'bg-gradient-to-br rounded-3xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-2xl transition-all group',
                    module.bgGradient
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg',
                      `bg-gradient-to-r ${module.gradient}`
                    )}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {data.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {data.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <span className="text-xs text-gray-500 dark:text-gray-400">模块</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {'modules' in data ? (data as any).modules.length : 
                         'departmentAssistants' in data ? (data as any).commonFeatures.length + 1 :
                         0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <span className="text-xs text-gray-500 dark:text-gray-400">功能</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {totalFeatures}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
