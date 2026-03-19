'use client';

import { Module, Feature } from '@/lib/products-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ModuleDetailListProps {
  modules: Module[];
  productGradient: string;
}

const colorMap: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  indigo: 'from-indigo-500 to-indigo-600',
  purple: 'from-purple-500 to-purple-600',
  cyan: 'from-cyan-500 to-cyan-600',
  green: 'from-green-500 to-green-600',
  emerald: 'from-emerald-500 to-emerald-600',
  teal: 'from-teal-500 to-teal-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
  rose: 'from-rose-500 to-rose-600',
  pink: 'from-pink-500 to-pink-600',
  amber: 'from-amber-500 to-amber-600',
  violet: 'from-violet-500 to-violet-600',
  fuchsia: 'from-fuchsia-500 to-fuchsia-600',
  gray: 'from-gray-500 to-gray-600',
};

export default function ModuleDetailList({ modules, productGradient }: ModuleDetailListProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedModules(new Set(modules.map(m => m.id)));
  };

  const collapseAll = () => {
    setExpandedModules(new Set());
  };

  return (
    <div className="space-y-4">
      {/* 全局操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-4 py-2 text-base">
            共 {modules.length} 个一级模块
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-base">
            共 {modules.reduce((sum, m) => sum + m.features.length, 0)} 个二级功能
          </Badge>
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            全部展开
          </button>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <button
            onClick={collapseAll}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            全部折叠
          </button>
        </div>
      </div>

      {/* 模块列表 */}
      <div className="space-y-3">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="overflow-hidden border-2 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              {/* 模块头部 */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-5 flex items-center justify-between text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg',
                    'bg-gradient-to-br',
                    colorMap[module.color || 'blue']
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {module.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {module.features.length} 项功能
                      </Badge>
                    </div>
                    {module.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {module.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {expandedModules.has(module.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* 功能列表 */}
              <AnimatePresence>
                {expandedModules.has(module.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-3 bg-gray-50 dark:bg-gray-800/50">
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700" />
                      {module.features.map((feature, featureIndex) => (
                        <FeatureItem
                          key={featureIndex}
                          feature={feature}
                          index={featureIndex}
                          gradient={colorMap[module.color || 'blue']}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface FeatureItemProps {
  feature: Feature;
  index: number;
  gradient: string;
}

function FeatureItem({ feature, index, gradient }: FeatureItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700"
    >
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5',
        'bg-gradient-to-br',
        gradient
      )}>
        {index + 1}
      </div>
      <div className="flex-1">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              {feature.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
