'use client';

import { Product } from '@/lib/products-data';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Building2, 
  Server, 
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Bot
} from 'lucide-react';

interface ProductOverviewCardProps {
  product: Product;
  onViewDetails: () => void;
}

export default function ProductOverviewCard({ product, onViewDetails }: ProductOverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-2 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
        <div className="p-6">
          {/* 产品定位 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-900 dark:text-white">产品定位</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.positioning}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 适用行业 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-gray-900 dark:text-white">适用行业</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.industries.map((industry, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 部署方式 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-5 h-5 text-purple-500" />
                <span className="font-semibold text-gray-900 dark:text-white">部署方式</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.deployment.map((deploy, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {deploy}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 核心价值 */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-900 dark:text-white">核心价值</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 模块概览 */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded bg-gradient-to-r ${product.gradient}`} />
                <span className="font-semibold text-gray-900 dark:text-white">
                  功能模块概览
                </span>
              </div>
              <Badge variant="secondary">{product.modules.length} 个模块</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {product.modules.slice(0, 6).map((module) => (
                <button
                  key={module.id}
                  onClick={onViewDetails}
                  className="p-2 text-left text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {module.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {module.features.length} 项功能
                  </div>
                </button>
              ))}
              {product.modules.length > 6 && (
                <button
                  onClick={onViewDetails}
                  className="p-2 text-center text-sm bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <div className="text-purple-600 dark:text-purple-400 font-medium">
                    +{product.modules.length - 6} 更多
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* 查看详情按钮 */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onViewDetails}
              className={`flex-1 py-3 rounded-lg font-medium text-white
                bg-gradient-to-r ${product.gradient} 
                hover:opacity-90 transition-opacity
                flex items-center justify-center gap-2
                shadow-lg hover:shadow-xl`}
            >
              <span>查看完整功能清单</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              className="px-6 py-3 rounded-lg font-medium border-2 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-2"
            >
              <Bot className="w-5 h-5" />
              <span>AI 解读</span>
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
