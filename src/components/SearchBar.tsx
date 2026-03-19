'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  X, 
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { products, Product, Module, Feature } from '@/lib/products-data';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchResult {
  product: Product;
  module?: Module;
  feature?: Feature;
  type: 'product' | 'module' | 'feature';
  matchedText: string;
}

interface SearchBarProps {
  onSearchResultClick: (productId: string, moduleId?: string) => void;
}

export default function SearchBar({ onSearchResultClick }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['product', 'module', 'feature']));

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const results: SearchResult[] = [];
    const term = searchTerm.toLowerCase();

    products.forEach((product) => {
      // 搜索产品名称和描述
      if (
        product.name.toLowerCase().includes(term) ||
        product.shortDescription.toLowerCase().includes(term) ||
        product.positioning.toLowerCase().includes(term)
      ) {
        if (selectedTypes.has('product')) {
          results.push({
            product,
            type: 'product',
            matchedText: product.name,
          });
        }
      }

      // 搜索模块
      product.modules.forEach((module) => {
        if (
          module.name.toLowerCase().includes(term) ||
          (module.description && module.description.toLowerCase().includes(term))
        ) {
          if (selectedTypes.has('module')) {
            results.push({
              product,
              module,
              type: 'module',
              matchedText: module.name,
            });
          }
        }

        // 搜索功能
        module.features.forEach((feature) => {
          if (
            feature.title.toLowerCase().includes(term) ||
            feature.description.toLowerCase().includes(term)
          ) {
            if (selectedTypes.has('feature')) {
              results.push({
                product,
                module,
                feature,
                type: 'feature',
                matchedText: feature.title,
              });
            }
          }
        });
      });
    });

    return results.slice(0, 20); // 限制结果数量
  }, [searchTerm, selectedTypes]);

  const handleResultClick = (result: SearchResult) => {
    onSearchResultClick(result.product.id, result.module?.id);
    setSearchTerm('');
    setIsSearchFocused(false);
  };

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        if (newSet.size > 1) {
          newSet.delete(type);
        }
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="搜索产品、模块或功能..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className="pl-12 pr-24 py-6 text-base rounded-xl border-2 focus:border-blue-500 dark:focus:border-blue-400"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-8 px-3"
          >
            <Filter className="w-4 h-4 mr-1" />
            筛选
            {showFilters ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
          </Button>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 筛选器 */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">搜索范围：</span>
              <div className="flex gap-2">
                {[
                  { type: 'product', label: '产品' },
                  { type: 'module', label: '模块' },
                  { type: 'feature', label: '功能' },
                ].map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => toggleTypeFilter(type)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium transition-all',
                      selectedTypes.has(type)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 搜索结果 */}
      <AnimatePresence>
        {isSearchFocused && searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="overflow-hidden shadow-2xl border-2">
              <div className="max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {searchResults.map((result, index) => (
                      <button
                        key={`${result.product.id}-${result.module?.id}-${result.feature?.title}-${index}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{result.product.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {result.type === 'product' ? '产品' : result.type === 'module' ? '模块' : '功能'}
                              </Badge>
                              <span className="font-semibold text-gray-900 dark:text-white truncate">
                                {result.matchedText}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {result.type === 'product'
                                ? result.product.shortDescription
                                : result.type === 'module'
                                ? result.module?.description
                                : result.feature?.description}
                            </p>
                            {result.module && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                路径：{result.product.name} {'>'} {result.module.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>未找到相关结果</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
