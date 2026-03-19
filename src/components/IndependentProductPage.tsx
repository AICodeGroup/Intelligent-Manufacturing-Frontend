'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Eye,
  Volume2,
  Users,
  BarChart3,
  CheckCircle2,
  Factory,
  Zap,
  Target,
  Layers,
  Settings
} from 'lucide-react';
import { independentProducts } from '@/lib/products-data-new';

interface IndependentProductPageProps {
  productId: string;
}

const iconMap: Record<string, any> = {
  'vision-inspection': Eye,
  'acoustic-inspection': Volume2,
  'behavior-recognition': Users,
  'intelligent-scheduling': BarChart3,
};

export default function IndependentProductPage({ productId }: IndependentProductPageProps) {
  const product = independentProducts.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">产品未找到</h2>
        </div>
      </div>
    );
  }

  const Icon = iconMap[productId] || Factory;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className={cn(
        'relative overflow-hidden text-white',
        `bg-gradient-to-r ${product.gradient}`
      )}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <p className="text-white/80 mt-1">{product.shortDescription}</p>
            </div>
          </div>

          {/* 核心价值 */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-white/80" />
              <span className="text-sm font-medium text-white/80">核心价值</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {product.coreValues.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{product.modules.length}</div>
              <div className="text-sm text-white/80">功能模块</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{product.modules.reduce((sum, m) => sum + m.features.length, 0)}</div>
              <div className="text-sm text-white/80">功能点</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{product.industries.length}</div>
              <div className="text-sm text-white/80">适用行业</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">{product.deployment.length}</div>
              <div className="text-sm text-white/80">部署方式</div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* 产品定位 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
              `bg-gradient-to-r ${product.gradient} text-white`
            )}>
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">产品定位</h3>
              <p className="text-gray-600 dark:text-gray-400">{product.positioning}</p>
            </div>
          </div>
        </motion.div>

        {/* 适用行业 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {product.industries.map((industry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 text-center"
            >
              <div className="font-medium text-gray-900 dark:text-white">{industry}</div>
            </motion.div>
          ))}
        </div>

        {/* 部署方式 */}
        <div className="flex gap-3 mb-8">
          {product.deployment.map((deploy, i) => (
            <div
              key={i}
              className={cn(
                'px-4 py-2 rounded-lg',
                `bg-gradient-to-r ${product.gradient} text-white`
              )}
            >
              {deploy}
            </div>
          ))}
        </div>

        {/* 功能模块列表 */}
        <div className="mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">功能模块</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* 模块头部 */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    `bg-gradient-to-r ${product.gradient} text-white`
                  )}>
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{module.name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {module.features.length} 功能
                    </span>
                  </div>
                </div>
              </div>

              {/* 功能列表 */}
              <div className="p-4">
                <div className="grid grid-cols-1 gap-2">
                  {module.features.map((feature, fIndex) => (
                    <motion.div
                      key={fIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 + fIndex * 0.02 }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
