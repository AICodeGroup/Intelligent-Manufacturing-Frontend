'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, 
  ChevronDown,
  Database,
  Network,
  Bot,
  Settings,
  Eye,
  Volume2,
  Users,
  BarChart3,
  Building2,
  Sparkles,
  BookOpen,
  Workflow
} from 'lucide-react';
import { useState } from 'react';

// 产品矩阵数据
const productStructure = {
  main: {
    id: 'knowledge-system',
    name: '未来未科技 · 智能知识管理系统',
    icon: Building2,
    description: '知识图谱 / 企业知识库 / 多部门AI问答助手',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    subModules: [
      {
        id: 'knowledge-base',
        name: '企业知识库',
        icon: Database,
        description: '多模态知识全生命周期管理底座',
        modules: 6,
        features: 27
      },
      {
        id: 'knowledge-graph',
        name: '知识图谱平台',
        icon: Network,
        description: '数据关联挖掘+智能决策底座',
        modules: 6,
        features: 32
      },
      {
        id: 'ai-assistant-center',
        name: 'AI问答助手中心',
        icon: Bot,
        description: '多部门场景化应用层',
        modules: 6,
        features: 40
      },
      {
        id: 'system-management',
        name: '系统管理',
        icon: Settings,
        description: '全平台共用后台管控',
        modules: 6,
        features: 28
      }
    ]
  },
  independent: [
    {
      id: 'vision-inspection',
      name: 'AI视觉质检',
      icon: Eye,
      description: '缺陷检测、装配防错、OCR、尺寸测量',
      gradient: 'from-green-500 via-emerald-500 to-teal-600',
      modules: 8,
      features: 45
    },
    {
      id: 'acoustic-inspection',
      name: 'AI声学质检',
      icon: Volume2,
      description: '设备异常、产品声学性能检测',
      gradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
      modules: 9,
      features: 42
    },
    {
      id: 'behavior-recognition',
      name: 'AI行为识别',
      icon: Users,
      description: '人员行为、区域安全实时识别',
      gradient: 'from-orange-500 via-red-500 to-rose-600',
      modules: 7,
      features: 35
    },
    {
      id: 'intelligent-scheduling',
      name: 'AI智能排产',
      icon: BarChart3,
      description: '生产计划自动生成、动态优化',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
      modules: 7,
      features: 32
    }
  ]
};

interface MainSidebarProps {
  activeProduct: string;
  onProductChange: (productId: string) => void;
  onModuleChange?: (moduleId: string) => void;
}

export default function MainSidebar({
  activeProduct,
  onProductChange,
  onModuleChange,
}: MainSidebarProps) {
  const [expandedMain, setExpandedMain] = useState(true);
  const [expandedIndependent, setExpandedIndependent] = useState(true);

  return (
    <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo区域 */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              产品功能矩阵
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              未来未科技 · 企业智能化平台
            </p>
          </div>
        </div>
      </div>

      {/* 导航区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 主产品 - 智能知识管理系统 */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setExpandedMain(!expandedMain)}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              未来未科技 · 智能知识管理系统
              </span>
            </div>
            {expandedMain ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedMain && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 mt-3 pl-2">
                  {productStructure.main.subModules.map((module) => {
                    const Icon = module.icon;
                    const isActive = activeProduct === module.id;
                    
                    return (
                      <motion.button
                        key={module.id}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          onProductChange(module.id);
                          onModuleChange?.(module.id);
                        }}
                        className={cn(
                          'w-full p-3 rounded-xl text-left transition-all border-2 group',
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-transparent'
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400'
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={cn(
                              'font-semibold text-sm mb-1',
                              isActive ? 'text-white' : 'text-gray-900 dark:text-white'
                            )}>
                              {module.name}
                            </h3>
                            <p className={cn(
                              'text-xs mb-2 line-clamp-1',
                              isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                            )}>
                              {module.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                'text-xs px-2 py-0.5 rounded-full',
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                              )}>
                                {module.modules} 模块
                              </span>
                              <span className={cn(
                                'text-xs px-2 py-0.5 rounded-full',
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                              )}>
                                {module.features} 功能
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 独立产品 */}
        <div className="p-4">
          <button
            onClick={() => setExpandedIndependent(!expandedIndependent)}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                独立产品系统
              </span>
            </div>
            {expandedIndependent ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedIndependent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {productStructure.independent.map((product) => {
                    const Icon = product.icon;
                    const isActive = activeProduct === product.id;
                    
                    return (
                      <motion.button
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onProductChange(product.id);
                          onModuleChange?.(product.id);
                        }}
                        className={cn(
                          'p-3 rounded-xl text-left transition-all border-2 relative overflow-hidden',
                          isActive
                            ? `bg-gradient-to-r ${product.gradient} text-white shadow-lg border-transparent`
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:shadow-md'
                        )}
                      >
                        {/* 背景装饰 */}
                        {!isActive && (
                          <div className={cn(
                            'absolute -right-2 -top-2 w-12 h-12 rounded-full opacity-10',
                            `bg-gradient-to-r ${product.gradient}`
                          )} />
                        )}
                        
                        <div className="relative z-10">
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center mb-2',
                            isActive
                              ? 'bg-white/20 text-white'
                              : `bg-gradient-to-r ${product.gradient} text-white`
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 className={cn(
                            'font-semibold text-xs mb-1',
                            isActive ? 'text-white' : 'text-gray-900 dark:text-white'
                          )}>
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              'text-xs',
                              isActive ? 'text-white/80' : 'text-gray-500'
                            )}>
                              {product.modules} 模块
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 快捷信息卡片 */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">产品统计</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">6</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">产品系统</div>
              </div>
              <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">42</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">功能模块</div>
              </div>
              <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">239</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">功能点</div>
              </div>
              <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">6</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">AI助手</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>© 2024 未来未科技</span>
          <span>v2.1.0</span>
        </div>
      </div>
    </aside>
  );
}
