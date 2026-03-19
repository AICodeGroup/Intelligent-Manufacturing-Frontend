'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  FileText, 
  HelpCircle, 
  Video, 
  Image,
  Clock,
  Eye,
  Tag,
  Building2,
  ChevronLeft,
  X,
  Bookmark,
  Share2,
  Download,
  ArrowRight
} from 'lucide-react';
import { knowledgeData, knowledgeCategories, KnowledgeItem } from '@/lib/demo-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface KnowledgePortalProps {
  onOpenAssistant?: (assistantId: string) => void;
}

export default function KnowledgePortal({ onOpenAssistant }: KnowledgePortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // 过滤知识
  const filteredKnowledge = useMemo(() => {
    return knowledgeData.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        item.category === knowledgeCategories.find(c => c.id === selectedCategory)?.name ||
        (selectedCategory === 'tech' && item.category === '技术标准') ||
        (selectedCategory === 'process' && (item.category === '流程规范' || item.category === '工艺参数')) ||
        (selectedCategory === 'device' && item.category === '设备维护') ||
        (selectedCategory === 'sales' && (item.category === '销售话术' || item.category === '促销政策')) ||
        (selectedCategory === 'service' && (item.category === '服务流程' || item.category === '故障FAQ')) ||
        (selectedCategory === 'hr' && (item.category === '人事制度' || item.category === '安全规范')) ||
        (selectedCategory === 'purchase' && (item.category === '采购管理' || item.category === '采购流程'));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'faq': return <HelpCircle className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // 高亮搜索关键词
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">$1</mark>');
  };

  // 知识详情页
  if (selectedKnowledge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* 详情头部 */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <button
              onClick={() => setSelectedKnowledge(null)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>返回知识库</span>
            </button>
          </div>
        </div>

        {/* 详情内容 */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* 标题区域 */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                      {getTypeIcon(selectedKnowledge.type)}
                    </div>
                    <Badge variant="secondary">{selectedKnowledge.category}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {selectedKnowledge.department}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedKnowledge.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      更新于 {selectedKnowledge.updateTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {selectedKnowledge.views} 次浏览
                    </span>
                    <span>来源：{selectedKnowledge.source}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-8">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {selectedKnowledge.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* 标签 */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {selectedKnowledge.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="mt-6 flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  收藏
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
              </div>
            </div>
          </motion.div>

          {/* 相关知识推荐 */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">相关知识</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knowledgeData
                .filter(k => k.id !== selectedKnowledge.id && k.department === selectedKnowledge.department)
                .slice(0, 2)
                .map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedKnowledge(item)}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 知识库列表页
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* 顶部搜索区 */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-2">企业知识库</h1>
          <p className="text-blue-100 mb-6">多模态知识全生命周期管理平台</p>
          
          {/* 搜索框 */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="搜索知识、文档、FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg bg-white dark:bg-gray-800 border-0 rounded-xl shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 快捷入口 */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => onOpenAssistant?.('assistant-rd')}
            >
              🔬 研发助手
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => onOpenAssistant?.('assistant-production')}
            >
              ⚙️ 生产助手
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => onOpenAssistant?.('assistant-service')}
            >
              🎧 客服助手
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* 左侧分类 */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">知识分类</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-8 w-8 p-0"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-1">
                {knowledgeCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left',
                      selectedCategory === category.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{category.count}</span>
                  </button>
                ))}
              </div>

              {/* 统计信息 */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {knowledgeData.length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">知识总量</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {knowledgeData.reduce((sum, k) => sum + k.views, 0)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">总浏览量</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1">
            {/* 搜索结果头部 */}
            {searchQuery && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  找到 <span className="font-semibold text-gray-900 dark:text-white">{filteredKnowledge.length}</span> 条相关知识
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  清除筛选
                </Button>
              </div>
            )}

            {/* 知识列表 */}
            <AnimatePresence mode="wait">
              {filteredKnowledge.length > 0 ? (
                <div className="space-y-4">
                  {filteredKnowledge.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedKnowledge(item)}
                      className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 text-left hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                            <Badge variant="outline" className="text-xs">{item.department}</Badge>
                          </div>
                          <h3 
                            className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                            dangerouslySetInnerHTML={{ __html: highlightText(item.title, searchQuery) }}
                          />
                          <p 
                            className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: highlightText(item.content.substring(0, 100) + '...', searchQuery) }}
                          />
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.updateTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {item.views} 次浏览
                            </span>
                            <div className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {item.tags.slice(0, 3).join(' · ')}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    未找到相关知识
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    尝试更换关键词或联系AI助手获取帮助
                  </p>
                  <Button
                    onClick={() => onOpenAssistant?.('assistant-production')}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500"
                  >
                    咨询AI助手
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
