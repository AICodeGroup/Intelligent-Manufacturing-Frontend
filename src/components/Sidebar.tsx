'use client';

import { products, productCategories } from '@/lib/products-data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  BarChart3,
  Settings,
  Workflow,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface SidebarProps {
  activeProduct: string;
  activeCategory: string;
  onProductChange: (productId: string) => void;
  onCategoryChange: (categoryId: string) => void;
}

export default function Sidebar({
  activeProduct,
  activeCategory,
  onProductChange,
  onCategoryChange,
}: SidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string>('products');

  const aiFeatures = [
    {
      id: 'agent-chat',
      icon: MessageSquare,
      name: 'AI 智能助手',
      description: '自然语言查询产品功能',
      status: 'ready',
      color: 'blue',
    },
    {
      id: 'agent-recommend',
      icon: Sparkles,
      name: '智能推荐',
      description: '基于需求推荐最佳产品',
      status: 'ready',
      color: 'purple',
    },
    {
      id: 'agent-analysis',
      icon: BarChart3,
      name: '功能对比分析',
      description: '多维度对比产品功能',
      status: 'developing',
      color: 'green',
    },
    {
      id: 'agent-workflow',
      icon: Workflow,
      name: '工作流编排',
      description: '自定义AI工作流',
      status: 'developing',
      color: 'orange',
    },
  ];

  return (
    <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo区域 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            AI
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              产品矩阵
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enterprise AI Platform
            </p>
          </div>
        </div>
      </div>

      {/* AI Agent功能区 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setExpandedSection(expandedSection === 'ai' ? '' : 'ai')}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-sm">AI Agent 功能</span>
          </div>
          <ChevronRight
            className={cn(
              'w-4 h-4 text-gray-400 transition-transform',
              expandedSection === 'ai' && 'rotate-90'
            )}
          />
        </button>

        {expandedSection === 'ai' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 space-y-2 overflow-hidden"
          >
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  className="w-full p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      `bg-${feature.color}-100 dark:bg-${feature.color}-900/30`,
                      `text-${feature.color}-500`
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {feature.name}
                        </span>
                        {feature.status === 'ready' && (
                          <Badge variant="default" className="text-xs bg-green-500">
                            可用
                          </Badge>
                        )}
                        {feature.status === 'developing' && (
                          <Badge variant="secondary" className="text-xs">
                            开发中
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                    <Zap className="w-4 h-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })}
            
            {/* OpenClaw 集成入口 */}
            <div className="mt-3 p-3 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  OpenClaw 集成
                </span>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-2">
                配置自定义AI工具和Agent工作流
              </p>
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Settings className="w-3 h-3 mr-1" />
                配置集成
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 分类筛选 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">分类筛选</span>
        </div>
        <div className="space-y-1">
          {productCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryChange(category.id);
                if (category.id !== 'all' && category.productIds && category.productIds.length > 0) {
                  onProductChange(category.productIds[0]);
                } else if (category.id === 'all') {
                  onProductChange(products[0].id);
                }
              }}
              className={cn(
                'w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 产品列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <button
          onClick={() => setExpandedSection(expandedSection === 'products' ? '' : 'products')}
          className="w-full flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">产品列表</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {products.length}
          </Badge>
        </button>

        <div className="space-y-2">
          {products.map((product) => {
            const isActive = activeProduct === product.id;
            return (
              <motion.button
                key={product.id}
                whileHover={{ x: 4 }}
                onClick={() => onProductChange(product.id)}
                className={cn(
                  'w-full p-3 rounded-xl text-left transition-all border-2',
                  isActive
                    ? `bg-gradient-to-r ${product.gradient} text-white shadow-lg border-transparent`
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md'
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{product.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      'font-semibold text-sm mb-1 truncate',
                      isActive ? 'text-white' : 'text-gray-900 dark:text-white'
                    )}>
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isActive ? 'secondary' : 'outline'}
                        className={cn(
                          'text-xs',
                          isActive && 'bg-white/20 text-white border-white/30'
                        )}
                      >
                        {product.modules.length} 模块
                      </Badge>
                      <Badge
                        variant={isActive ? 'secondary' : 'outline'}
                        className={cn(
                          'text-xs',
                          isActive && 'bg-white/20 text-white border-white/30'
                        )}
                      >
                        {product.modules.reduce((sum, m) => sum + m.features.length, 0)} 功能
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 底部信息 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>© 2024 Enterprise AI</span>
          <span>v2.0.0</span>
        </div>
      </div>
    </aside>
  );
}
