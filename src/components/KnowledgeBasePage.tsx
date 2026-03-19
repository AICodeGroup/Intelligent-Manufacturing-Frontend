'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Search, 
  User, 
  Globe,
  Download,
  Settings,
  Shield,
  BarChart3,
  Link2,
  ChevronRight,
  Eye,
  Monitor,
  Users,
  FileText,
  Video,
  Image,
  Tag,
  Clock,
  CheckCircle2,
  Lock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { knowledgeBaseData } from '@/lib/products-data-new';
import { useState } from 'react';

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend'>('frontend');

  const tabs = [
    { id: 'frontend' as const, label: '前端使用功能', icon: Eye, description: '面向企业普通员工，聚焦使用/查询/交互' },
    { id: 'backend' as const, label: '后台管理功能', icon: Settings, description: '面向系统管理员，聚焦配置/管控/运维' }
  ];

  const iconMap: Record<string, any> = {
    'kb-portal': Monitor,
    'kb-search': Search,
    'kb-personal': User,
    'kb-multilang': Globe,
    'kb-input': Download,
    'kb-process': Settings,
    'kb-domain': FileText,
    'kb-compliance': Shield,
    'kb-analytics': BarChart3,
    'kb-integration': Link2,
  };

  const currentModules = activeTab === 'frontend' 
    ? knowledgeBaseData.frontendModules 
    : knowledgeBaseData.backendModules;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{knowledgeBaseData.name}</h1>
              <p className="text-blue-100 mt-1">{knowledgeBaseData.description}</p>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{knowledgeBaseData.frontendModules.length}</div>
              <div className="text-sm text-blue-100">前端模块</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{knowledgeBaseData.backendModules.length}</div>
              <div className="text-sm text-blue-100">后台模块</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">
                {knowledgeBaseData.frontendModules.reduce((sum, m) => sum + m.features.length, 0)}
              </div>
              <div className="text-sm text-blue-100">前端功能</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">
                {knowledgeBaseData.backendModules.reduce((sum, m) => sum + m.features.length, 0)}
              </div>
              <div className="text-sm text-blue-100">后台功能</div>
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
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-xl'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    activeTab === tab.id ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/30'
                  )}>
                    <Icon className={cn(
                      'w-5 h-5',
                      activeTab === tab.id ? 'text-white' : 'text-blue-600 dark:text-blue-400'
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
                  activeTab === tab.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
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
            const Icon = iconMap[module.id] || FileText;
            
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
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
                    : 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800'
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center shadow-md',
                      activeTab === 'frontend'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
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
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className={cn(
                              'w-5 h-5 flex-shrink-0 mt-0.5',
                              activeTab === 'frontend' 
                                ? 'text-blue-500' 
                                : 'text-gray-500'
                            )} />
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
          className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-100 dark:border-blue-800"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                制造企业专属适配
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                企业知识库深度适配制造业场景，支持工艺参数、设备操作视频、CAD图纸等多模态知识管理，
                严格区分前后端功能权限，前端聚焦员工使用体验，后台实现全面管控，保障企业知识资产安全与合规。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
