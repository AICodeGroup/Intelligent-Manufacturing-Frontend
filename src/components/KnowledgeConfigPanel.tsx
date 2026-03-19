'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  Database, 
  Bot, 
  Users, 
  BarChart3, 
  Shield,
  Upload,
  FileText,
  Video,
  Image,
  HelpCircle,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Building2,
  Tag
} from 'lucide-react';
import { knowledgeData, knowledgeConfig, aiAssistants } from '@/lib/demo-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type TabType = 'overview' | 'knowledge' | 'assistants' | 'departments' | 'stats' | 'security';

export default function KnowledgeConfigPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'overview' as TabType, name: '总览', icon: Activity },
    { id: 'knowledge' as TabType, name: '知识管理', icon: Database },
    { id: 'assistants' as TabType, name: '助手配置', icon: Bot },
    { id: 'departments' as TabType, name: '部门管理', icon: Building2 },
    { id: 'stats' as TabType, name: '统计分析', icon: BarChart3 },
    { id: 'security' as TabType, name: '安全权限', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* 顶部导航 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">知识库管理后台</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">系统管理员专用</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                导入知识
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
                <Plus className="w-4 h-4 mr-2" />
                新建知识
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* 左侧菜单 */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sticky top-6">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left',
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1">
            {/* 总览 */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 统计卡片 */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: '知识总量', value: knowledgeData.length, icon: Database, color: 'blue' },
                    { label: 'AI助手', value: aiAssistants.length, icon: Bot, color: 'purple' },
                    { label: '部门知识域', value: knowledgeConfig.departments.length, icon: Building2, color: 'green' },
                    { label: '今日问答', value: '1,234', icon: Activity, color: 'orange' },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                          </div>
                          <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center',
                            stat.color === 'blue' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-500',
                            stat.color === 'purple' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-500',
                            stat.color === 'green' && 'bg-green-100 dark:bg-green-900/30 text-green-500',
                            stat.color === 'orange' && 'bg-orange-100 dark:bg-orange-900/30 text-orange-500',
                          )}>
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* 近期动态 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    近期动态
                  </h3>
                  <div className="space-y-3">
                    {knowledgeConfig.recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          activity.action === '新增' ? 'bg-green-500' :
                          activity.action === '更新' ? 'bg-blue-500' : 'bg-purple-500'
                        )} />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-16">
                          {activity.action}
                        </span>
                        <span className="flex-1 text-sm text-gray-900 dark:text-white">{activity.item}</span>
                        <span className="text-sm text-gray-400">{activity.user}</span>
                        <span className="text-sm text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 知识类型分布 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">知识类型分布</h3>
                    <div className="space-y-3">
                      {knowledgeConfig.knowledgeTypes.map((type, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-lg">{type.icon}</span>
                          <span className="flex-1 text-sm text-gray-600 dark:text-gray-300">{type.name}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{type.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">助手使用排行</h3>
                    <div className="space-y-3">
                      {aiAssistants.slice(0, 4).map((asst, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-lg">{asst.avatar}</span>
                          <span className="flex-1 text-sm text-gray-600 dark:text-gray-300">{asst.name}</span>
                          <span className="text-sm text-gray-400">{Math.floor(Math.random() * 500 + 100)}次</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 知识管理 */}
            {activeTab === 'knowledge' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {/* 搜索栏 */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="搜索知识标题、内容..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">高级筛选</Button>
                  </div>
                </div>

                {/* 知识列表 */}
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {knowledgeData.filter(k => 
                    searchQuery === '' || 
                    k.title.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                          {item.type === 'document' && <FileText className="w-5 h-5" />}
                          {item.type === 'faq' && <HelpCircle className="w-5 h-5" />}
                          {item.type === 'video' && <Video className="w-5 h-5" />}
                          {item.type === 'image' && <Image className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                            <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                            <Badge variant="outline" className="text-xs">{item.department}</Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{item.content.substring(0, 80)}...</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>更新：{item.updateTime}</span>
                            <span>浏览：{item.views}</span>
                            <span>来源：{item.source}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 助手配置 */}
            {activeTab === 'assistants' && (
              <div className="grid grid-cols-2 gap-4">
                {aiAssistants.map((asst, i) => (
                  <motion.div
                    key={asst.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                          {asst.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{asst.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{asst.department}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        配置
                      </Button>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{asst.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {asst.capabilities.map((cap, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">{cap}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">状态</span>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-green-600 dark:text-green-400">运行中</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 部门管理 */}
            {activeTab === 'departments' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">部门知识域管理</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    新增部门
                  </Button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {knowledgeConfig.departments.map((dept, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{dept.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                              <span>{dept.knowledgeCount} 条知识</span>
                              <span>·</span>
                              <span>{dept.assistants.length} 个助手</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            查看
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            编辑
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 统计分析 */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: '本周问答量', value: '2,345', trend: '+12%', up: true },
                    { label: '平均响应时间', value: '1.2s', trend: '-8%', up: true },
                    { label: '答案采纳率', value: '89%', trend: '+5%', up: true },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                      <div className="flex items-end gap-2 mt-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                        <span className={cn(
                          'text-sm font-medium',
                          stat.up ? 'text-green-500' : 'text-red-500'
                        )}>
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    问答趋势
                  </h3>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[65, 72, 58, 80, 75, 90, 85].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all hover:from-blue-600 hover:to-cyan-600"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-400">周{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 安全权限 */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gray-400" />
                    权限设置
                  </h3>
                  <div className="space-y-4">
                    {['超级管理员', '知识运营管理员', '部门负责人', '普通员工'].map((role, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">{role}</span>
                        </div>
                        <Button variant="outline" size="sm">配置权限</Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">安全提示</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        请确保定期审核用户权限，及时清理离职员工账号。核心知识建议启用二次验证。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
