'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  Users,
  Shield,
  Activity,
  FileText,
  Link2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Database,
  Bell,
  RefreshCw,
  Clock
} from 'lucide-react';
import { systemManagementData } from '@/lib/products-data-new';
import { useState } from 'react';

export default function SystemManagementPage() {
  const iconMap: Record<string, any> = {
    'sys-user': Users,
    'sys-params': Settings,
    'sys-security': Shield,
    'sys-monitor': Activity,
    'sys-log': FileText,
    'sys-integration': Link2,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{systemManagementData.name}</h1>
              <p className="text-green-100 mt-1">{systemManagementData.description}</p>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{systemManagementData.modules.length}</div>
              <div className="text-sm text-green-100">管理模块</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">
                {systemManagementData.modules.reduce((sum, m) => sum + m.features.length, 0)}
              </div>
              <div className="text-sm text-green-100">功能点</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">6</div>
              <div className="text-sm text-green-100">角色类型</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">SSO</div>
              <div className="text-sm text-green-100">支持方式</div>
            </div>
          </div>

          {/* 快速访问 */}
          <div className="grid grid-cols-6 gap-3 mt-6">
            {[
              { icon: Building2, label: '组织架构' },
              { icon: Users, label: '用户管理' },
              { icon: Shield, label: '权限配置' },
              { icon: Database, label: '数据备份' },
              { icon: Bell, label: '告警设置' },
              { icon: Link2, label: '系统集成' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs">{item.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* 权限说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-800"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-300">
              <strong>权限提示：</strong>系统基础管理功能仅对超级管理员开放，普通员工无任何访问权限
            </span>
          </div>
        </motion.div>

        {/* 模块列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systemManagementData.modules.map((module, index) => {
            const Icon = iconMap[module.id] || Settings;
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                {/* 模块头部 */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-r from-green-500 to-teal-500 text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {module.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {module.features.length} 个功能点
                      </span>
                    </div>
                  </div>
                </div>

                {/* 功能列表 */}
                <div className="p-5">
                  <div className="space-y-2">
                    {module.features.map((feature, fIndex) => (
                      <motion.div
                        key={fIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 + fIndex * 0.03 }}
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {feature.title}
                          </span>
                          <span className="text-gray-400 mx-1">·</span>
                          <span className="text-gray-600 dark:text-gray-400 text-xs">
                            {feature.description}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 角色权限说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                角色权限体系
              </h3>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: '超级管理员', desc: '全平台管控权限', color: 'red' },
                { name: '知识运营管理员', desc: '知识库管理权限', color: 'orange' },
                { name: '数据管理员', desc: '图谱数据管理权限', color: 'purple' },
                { name: '部门负责人', desc: '本部门管理权限', color: 'blue' },
                { name: '普通员工', desc: '前端使用权限', color: 'green' },
                { name: '车间员工', desc: '车间专属权限', color: 'cyan' },
              ].map((role, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-center"
                >
                  <div className={cn(
                    'w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center text-white text-sm',
                    i === 0 && 'bg-red-500',
                    i === 1 && 'bg-orange-500',
                    i === 2 && 'bg-purple-500',
                    i === 3 && 'bg-blue-500',
                    i === 4 && 'bg-green-500',
                    i === 5 && 'bg-cyan-500',
                  )}>
                    {i + 1}
                  </div>
                  <div className="font-medium text-sm text-gray-900 dark:text-white">{role.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{role.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 登录方式 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                支持登录方式
              </h3>
            </div>
          </div>

          <div className="p-5">
            <div className="flex flex-wrap gap-3">
              {[
                { icon: '🔑', label: '账号密码登录' },
                { icon: '💬', label: '企业微信登录' },
                { icon: '📱', label: '钉钉登录' },
                { icon: '🔐', label: '单点登录(SSO)' },
                { icon: '📷', label: '车间扫码登录' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 底部说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl border border-green-100 dark:border-green-800"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                全平台安全管控
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                系统基础管理模块实现全平台统一管控，支持用户与组织架构管理、数据安全与备份、系统监控与告警、
                操作日志审计、第三方系统集成等核心功能，保障企业智能化平台安全稳定运行。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
