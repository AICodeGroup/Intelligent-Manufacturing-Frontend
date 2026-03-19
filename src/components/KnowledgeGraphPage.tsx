'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Network, 
  Eye, 
  Search, 
  MessageCircle,
  Brain,
  Download,
  Tag,
  Settings,
  Target,
  Shield,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  GitBranch,
  Layers,
  Activity
} from 'lucide-react';
import { knowledgeGraphData } from '@/lib/products-data-new';
import { useState } from 'react';

export default function KnowledgeGraphPage() {
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend'>('frontend');

  const tabs = [
    { id: 'frontend' as const, label: '前端使用功能', icon: Eye, description: '仅管理员/技术部/生产决策层可见' },
    { id: 'backend' as const, label: '后台管理功能', icon: Settings, description: '仅超级管理员/数据管理员可见' }
  ];

  const iconMap: Record<string, any> = {
    'kg-overview': Eye,
    'kg-search': Search,
    'kg-qa': MessageCircle,
    'kg-decision': Brain,
    'kg-data': Download,
    'kg-label': Tag,
    'kg-build': GitBranch,
    'kg-expert': Target,
    'kg-security': Shield,
    'kg-analytics': TrendingUp,
  };

  const currentModules = activeTab === 'frontend' 
    ? knowledgeGraphData.frontendModules 
    : knowledgeGraphData.backendModules;

  // 知识图谱核心维度
  const graphDimensions = [
    { name: '产品', icon: '📦', description: '产品型号、参数、关联工艺' },
    { name: '设备', icon: '⚙️', description: '设备状态、维护记录、故障知识' },
    { name: '工艺', icon: '🔧', description: '工艺流程、参数、优化建议' },
    { name: '物料', icon: '📋', description: '物料属性、供应商、库存' },
    { name: '客户', icon: '👥', description: '客户画像、需求、订单' },
    { name: '供应商', icon: '🏢', description: '供应商信息、合作记录' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
              <Network className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{knowledgeGraphData.name}</h1>
              <p className="text-purple-100 mt-1">{knowledgeGraphData.description}</p>
            </div>
          </div>

          {/* 核心维度展示 */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-purple-200" />
              <span className="text-sm font-medium text-purple-100">六大核心维度</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {graphDimensions.map((dim, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <div className="text-2xl mb-1">{dim.icon}</div>
                  <div className="font-semibold text-sm">{dim.name}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{knowledgeGraphData.frontendModules.length}</div>
              <div className="text-sm text-purple-100">前端模块</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{knowledgeGraphData.backendModules.length}</div>
              <div className="text-sm text-purple-100">后台模块</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">
                {knowledgeGraphData.frontendModules.reduce((sum, m) => sum + m.features.length, 0)}
              </div>
              <div className="text-sm text-purple-100">前端功能</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">
                {knowledgeGraphData.backendModules.reduce((sum, m) => sum + m.features.length, 0)}
              </div>
              <div className="text-sm text-purple-100">后台功能</div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tab 切换 */}
        <div className="flex gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 p-6 rounded-2xl border-2 transition-all text-left',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-xl'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    activeTab === tab.id ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/30'
                  )}>
                    <Icon className={cn(
                      'w-5 h-5',
                      activeTab === tab.id ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                    )} />
                  </div>
                  <span className={cn(
                    'font-bold text-lg',
                    activeTab === tab.id ? 'text-white' : 'text-gray-900 dark:text-white'
                  )}>
                    {tab.label}
                  </span>
                </div>
                <p className={cn(
                  'text-sm',
                  activeTab === tab.id ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {tab.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* 模块列表 */}
        <div className="space-y-6">
          {currentModules.map((module, index) => {
            const Icon = iconMap[module.id] || Activity;
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                {/* 模块头部 */}
                <div className={cn(
                  'p-6 border-b border-gray-100 dark:border-gray-700',
                  activeTab === 'frontend' 
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
                    : 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800'
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center shadow-md',
                      activeTab === 'frontend'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gradient-to-r from-gray-600 to-slate-600 text-white'
                    )}>
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
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-md">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className={cn(
                              'w-5 h-5 flex-shrink-0 mt-0.5',
                              activeTab === 'frontend' 
                                ? 'text-purple-500' 
                                : 'text-gray-500'
                            )} />
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
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

        {/* 底部说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                智能决策支撑
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                知识图谱平台作为企业数据关联挖掘底座，打通多源异构数据，构建六大核心维度知识网络，
                支撑复杂关联问答、智能决策建议，实现数据价值最大化，辅助管理层科学决策。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
