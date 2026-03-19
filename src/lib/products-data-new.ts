// 智能知识管理系统 - 完整数据结构

// ==================== 企业知识库 ====================
export const knowledgeBaseData = {
  id: 'knowledge-base',
  name: '企业知识库',
  icon: '📚',
  description: '多模态知识全生命周期管理底座',
  frontendModules: [
    {
      id: 'kb-portal',
      name: '知识门户与概览',
      icon: '🏠',
      features: [
        { title: '可视化展示', description: '所属部门知识域核心数据（知识总量、更新率、使用率、高频知识）' },
        { title: '多维度分类导航', description: '按业务类型/工序/产品/问题类型分类' },
        { title: '快捷入口', description: '知识检索、我的收藏、我的反馈、所属部门问答助手' },
      ]
    },
    {
      id: 'kb-search',
      name: '智能知识检索',
      icon: '🔍',
      features: [
        { title: '多方式检索', description: '关键词/自然语言/模糊检索，支持生产工艺、设备参数等制造专业术语' },
        { title: '多维度筛选', description: '按知识域/知识类型/更新时间/适用场景筛选' },
        { title: '检索结果展示', description: '标题+摘要+知识来源+适用场景，支持按相关性/使用率排序' },
        { title: '知识详情查看', description: '图文/视频/附件形式，适配设备操作视频、工艺图纸等' },
      ]
    },
    {
      id: 'kb-personal',
      name: '个人知识管理',
      icon: '👤',
      features: [
        { title: '知识收藏', description: '收藏高频使用知识，生成个人知识夹' },
        { title: '检索/浏览历史', description: '留存操作记录，支持一键重查' },
        { title: '知识反馈', description: '对错误/过期知识进行纠错/建议，提交反馈记录' },
        { title: '知识分享', description: '企业内部分享，带权限控制，适配跨部门工艺知识共享' },
      ]
    },
    {
      id: 'kb-multilang',
      name: '多语言知识查看',
      icon: '🌐',
      features: [
        { title: '自动识别语言', description: '自动识别用户语言，展示对应语种知识' },
        { title: '语种手动切换', description: '中/英/小语种，支持设备进口资料多语言查看' },
      ]
    },
  ],
  backendModules: [
    {
      id: 'kb-input',
      name: '多模态知识接入管理',
      icon: '📥',
      features: [
        { title: '多类型知识导入', description: 'FAQ/文档/视频/图纸/网页/API接口同步' },
        { title: '多渠道接入配置', description: '手动录入/文件批量导入/网页采集/业务系统对接(ERP/MES/PLM)' },
        { title: '知识接入审核', description: '待接入知识校验，过滤重复/无效知识' },
        { title: '批量知识处理', description: '批量分类/打标/归档，提升知识接入效率' },
      ]
    },
    {
      id: 'kb-process',
      name: '知识处理与萃取管控',
      icon: '⚙️',
      features: [
        { title: '智能萃取配置', description: '设置大模型萃取规则，从非结构化知识中提取核心结构化信息' },
        { title: '知识标准化管理', description: '统一制造专业术语、知识格式、分类规则' },
        { title: '知识去重与冲突校验', description: '自动识别重复知识，标记矛盾知识，提醒人工复核' },
        { title: '知识标签体系配置', description: '自定义制造行业专属标签（产品型号/设备型号/工序名称/车间名称）' },
      ]
    },
    {
      id: 'kb-domain',
      name: '知识域与全生命周期管理',
      icon: '🗂️',
      features: [
        { title: '部门知识域创建', description: '按组织架构创建研发/生产/营销/客服/人力/设备管理等知识域' },
        { title: '知识空间配置', description: '对内核心库/对外公开库/主题库' },
        { title: '知识全流程管控', description: '知识发布/审核/更新/归档/删除，支持多节点审批' },
        { title: '知识版本管理', description: '留存知识迭代版本，支持版本对比/回溯' },
        { title: '过期知识管控', description: '设置知识有效期，到期自动提醒更新/归档' },
      ]
    },
    {
      id: 'kb-compliance',
      name: '合规与安全管控',
      icon: '🔒',
      features: [
        { title: '精细化权限配置', description: '按"企业-部门-岗位-个人"分级控制知识查看/编辑/发布/共享权限' },
        { title: '知识时效性审查', description: '定期自动审查+人工复核，标记有效/失效知识' },
        { title: '大模型回复幻觉控制', description: '配置答案校验规则，强制引用知识库权威知识' },
        { title: '内外知识库隔离', description: '物理隔离对内核心知识与对外公开知识' },
        { title: '操作日志管理', description: '留存所有知识操作记录，支持按用户/部门/操作类型检索' },
      ]
    },
    {
      id: 'kb-analytics',
      name: '知识运营与统计分析',
      icon: '📊',
      features: [
        { title: '核心运营指标统计', description: '知识接入量/更新率/检索率/使用率/准确率/反馈率' },
        { title: '制造场景专项统计', description: '设备故障知识使用率/工艺标准知识更新率/售后问题知识匹配率' },
        { title: '用户行为分析', description: '员工检索习惯/知识偏好/使用频次' },
        { title: '知识质量评估', description: '按使用率/反馈结果/准确性评分，标记低质量知识' },
        { title: '多维度报表生成', description: '日报/周报/月报，支持Excel/PDF/可视化图表导出' },
        { title: '运营优化建议', description: '基于统计数据，推荐知识补充/优化/删除方向' },
      ]
    },
    {
      id: 'kb-integration',
      name: '系统对接与联动配置',
      icon: '🔗',
      features: [
        { title: '业务系统对接', description: '与ERP/MES/PLM/客服系统等制造企业核心系统对接' },
        { title: '知识图谱联动', description: '设置知识库结构化知识同步至知识图谱的规则/频率' },
      ]
    },
  ]
};

// ==================== 知识图谱平台 ====================
export const knowledgeGraphData = {
  id: 'knowledge-graph',
  name: '知识图谱平台',
  icon: '🕸️',
  description: '制造企业数据关联挖掘+智能决策底座',
  frontendModules: [
    {
      id: 'kg-overview',
      name: '图谱可视化概览',
      icon: '👁️',
      features: [
        { title: '全域知识图谱展示', description: '按"产品/设备/工艺/物料/客户/供应商"六大核心维度构建' },
        { title: '多视角图谱查看', description: '全局视图/局部视图/关联路径视图，支持缩放/平移/节点筛选' },
        { title: '核心图谱指标', description: '节点数/关系数/更新时间/关联挖掘次数' },
      ]
    },
    {
      id: 'kg-search',
      name: '图谱深度检索与分析',
      icon: '🔎',
      features: [
        { title: '多维度图谱检索', description: '按节点名称/类型/属性检索' },
        { title: '关联路径挖掘', description: '自动挖掘数据间隐藏关联，可视化展示关联路径' },
        { title: '节点详情查看', description: '展示节点属性+关联关系+相关知识' },
      ]
    },
    {
      id: 'kg-qa',
      name: '自然语言深度问答',
      icon: '💬',
      features: [
        { title: '复杂问题问答', description: '支持自然语言提问复杂关联问题' },
        { title: '问答结果溯源', description: '答案附带图谱关联路径+知识库知识来源' },
      ]
    },
    {
      id: 'kg-decision',
      name: '智能决策辅助查看',
      icon: '🧠',
      features: [
        { title: '决策建议展示', description: '生产排产优化/工艺改进/设备维护/物料采购建议' },
        { title: '决策依据可视化', description: '关联图谱数据+知识库知识，展示决策背后的逻辑' },
        { title: '决策方案对比', description: '支持多套决策方案的关联数据对比' },
      ]
    },
  ],
  backendModules: [
    {
      id: 'kg-data',
      name: '异构数据接入与整合配置',
      icon: '📥',
      features: [
        { title: '多源数据对接', description: '对接企业知识库/ERP/MES/PLM/设备传感器等异构数据源' },
        { title: '数据格式兼容', description: '统一数据格式，适配结构化/半结构化数据' },
        { title: '数据清洗与预处理', description: '设置去重/纠错/补全/归一化规则' },
        { title: '数据同步配置', description: '设置实时/定时同步频率' },
        { title: '知识库数据联动', description: '设置接收企业知识库结构化知识的规则' },
      ]
    },
    {
      id: 'kg-label',
      name: '数据标注与模型训练管控',
      icon: '🏷️',
      features: [
        { title: '可视化标注工具', description: '提供制造行业专属节点/关系标注模板' },
        { title: '标注规则配置', description: '自定义图谱节点/关系分类规则' },
        { title: '模型训练与调参', description: '训练图谱构建/关联挖掘模型' },
        { title: '模型重训练', description: '基于新数据/反馈结果触发模型重训练' },
        { title: '模型性能监控', description: '实时展示模型准确率/召回率/推理速度' },
      ]
    },
    {
      id: 'kg-build',
      name: '知识图谱构建与编辑管控',
      icon: '🔨',
      features: [
        { title: '自动化图谱生成', description: '设置图谱构建规则，自动生成结构化知识图谱' },
        { title: '图谱结构自定义', description: '自定义图谱层级/关联规则/展示样式' },
        { title: '可视化图谱编辑', description: '支持节点/关系/属性的增删改查' },
        { title: '图谱版本管理', description: '留存图谱迭代版本，支持版本对比/回溯' },
        { title: '图谱导出与共享', description: '支持导出为图片/结构化文件/可视化链接' },
      ]
    },
    {
      id: 'kg-expert',
      name: '智能决策支撑配置',
      icon: '🎯',
      features: [
        { title: '决策规则配置', description: '按场景配置生产排产/工艺改进/设备维护等决策规则' },
        { title: '专家系统搭建', description: '搭建设备故障诊断专家系统、工艺优化专家系统' },
        { title: '决策建议生成', description: '设置决策建议的生成逻辑/展示形式' },
        { title: '决策效果监控', description: '跟踪决策落地效果，持续优化决策模型' },
      ]
    },
    {
      id: 'kg-security',
      name: '图谱数据安全与管控',
      icon: '🔐',
      features: [
        { title: '图谱权限配置', description: '按角色控制图谱查看/编辑/分析/决策权限' },
        { title: '核心数据加密', description: '对研发工艺、核心配方等核心数据加密存储/传输' },
        { title: '异常操作预警', description: '识别违规图谱操作，实时触发告警' },
        { title: '操作日志管理', description: '留存所有图谱操作记录' },
      ]
    },
    {
      id: 'kg-analytics',
      name: '图谱统计与价值分析',
      icon: '📈',
      features: [
        { title: '图谱核心指标统计', description: '节点数/关系数/关联挖掘次数/问答次数' },
        { title: '制造场景价值分析', description: '工艺优化建议落地率/设备故障诊断准确率' },
        { title: '图谱数据使用率', description: '各维度节点/关系的使用频率分析' },
        { title: '多维度报表生成', description: '图谱运营/决策价值报表' },
      ]
    },
  ]
};

// ==================== 多部门AI问答助手中心 ====================
export const aiAssistantData = {
  id: 'ai-assistant-center',
  name: '多部门AI问答助手中心',
  icon: '🤖',
  description: '制造企业场景化应用层，基于双底座赋能',
  commonFeatures: [
    {
      id: 'assistant-workspace',
      name: '助手工作台',
      icon: '🏠',
      features: [
        { title: '卡片式助手展示', description: '显示助手名称/所属部门/问答次数/最新更新' },
        { title: '一键进入对话', description: '支持快捷入口收藏（桌面/企业微信/钉钉内嵌）' },
      ]
    },
    {
      id: 'assistant-qa',
      name: '核心问答交互',
      icon: '💬',
      features: [
        { title: '自然语言提问', description: '支持文字/语音，适配车间一线员工手持设备操作' },
        { title: '多媒体提问', description: '支持粘贴图片/图纸/截图' },
        { title: '气泡式对话流', description: '用户问题左对齐，AI答案右对齐，简洁直观' },
        { title: '答案溯源', description: '附带知识库/知识图谱来源，点击可查看原文/关联路径' },
      ]
    },
    {
      id: 'assistant-personal',
      name: '个人交互管理',
      icon: '👤',
      features: [
        { title: '问答历史记录', description: '留存提问记录，支持一键重查/删除' },
        { title: '答案收藏', description: '收藏高频问答结果，生成个人问答夹' },
        { title: '答案反馈', description: '对错误/不准确答案进行纠错/建议' },
      ]
    },
    {
      id: 'assistant-tools',
      name: '轻量化辅助功能',
      icon: '⚡',
      features: [
        { title: '快捷提问', description: '预设本部门高频问题，点击即问' },
        { title: '场景插件', description: '本部门核心场景化工具，图标化展示' },
        { title: '多语言问答', description: '支持多语种提问/解答' },
      ]
    },
  ],
  departmentAssistants: [
    {
      id: 'assistant-rd',
      name: 'AI研发选型问答助手',
      icon: '🔬',
      department: '研发部/技术部',
      color: 'blue',
      quickQuestions: ['某材料选型标准', '某设备参数', '某专利查询', '某工艺故障解决方案', '某产品研发配方'],
      plugins: [
        { name: '选型对比', description: '材料/设备/工艺参数对比' },
        { name: '风险提醒', description: '选型/研发工艺潜在风险' },
        { name: '专利检索', description: '对接专利库，快速检索' },
      ],
      capabilities: ['专业术语精准识别', '工艺/配方数据精准解答', '研发方案关联推荐']
    },
    {
      id: 'assistant-production',
      name: 'AI生产工艺问答助手',
      icon: '🏭',
      department: '生产车间/生产部/设备管理部',
      color: 'green',
      quickQuestions: ['某工序工艺参数', '某设备操作规范', '某设备故障处理', '质量管控标准', '生产排产规则'],
      plugins: [
        { name: '参数推荐', description: '最优工艺参数推荐' },
        { name: '故障诊断', description: '设备故障快速诊断' },
        { name: '视频解答', description: '复杂操作/故障处理视频推送' },
      ],
      capabilities: ['适配车间一线员工操作习惯', '支持图文/视频解答', '设备传感器数据关联解答']
    },
    {
      id: 'assistant-marketing',
      name: 'AI营销问答助手',
      icon: '📈',
      department: '营销部/销售部/市场部',
      color: 'purple',
      quickQuestions: ['某产品参数/卖点', '最新产品优惠政策', '竞品对比', '客户常见问题', '经销商政策'],
      plugins: [
        { name: '话术推荐', description: '客户咨询/电话销售话术' },
        { name: '素材调取', description: '产品海报/案例/工艺介绍素材' },
        { name: '客户画像匹配', description: '基于客户需求推荐产品' },
      ],
      capabilities: ['营销化口语化回复', '产品与制造工艺关联解答']
    },
    {
      id: 'assistant-service',
      name: 'AI客服坐席问答助手',
      icon: '🎧',
      department: '客服部/售后部',
      color: 'orange',
      quickQuestions: ['某产品售后故障', '退换货规则', '物流查询', '保修政策', '设备安装指导'],
      plugins: [
        { name: '快捷回复', description: '答案一键发送至工单系统' },
        { name: '故障分类', description: '客户问题自动分类' },
        { name: '售后工单联动', description: '对接工单系统，同步客户问题' },
      ],
      capabilities: ['标准化简洁回复', '售后问题与生产/工艺关联解答']
    },
    {
      id: 'assistant-hr',
      name: 'AI人力行政问答助手',
      icon: '👥',
      department: '人力部/行政部/综合部',
      color: 'cyan',
      quickQuestions: ['企业规章制度', '考勤福利', '招聘培训', '办公流程', '车间安全规范'],
      plugins: [
        { name: '流程审批入口', description: '对接OA系统' },
        { name: '考勤计算', description: '自动计算考勤' },
        { name: '安全规范查询', description: '制造企业车间安全专属' },
      ],
      capabilities: ['通俗全面回复', '制造企业车间安全规范精准解答']
    },
    {
      id: 'assistant-procurement',
      name: 'AI采购供应链问答助手',
      icon: '📦',
      department: '采购部/供应链部',
      color: 'amber',
      quickQuestions: ['某物料供应商信息', '物料采购标准', '库存查询', '供应链流程', '物料与工艺匹配要求'],
      plugins: [
        { name: '供应商对比', description: '多维度对比供应商' },
        { name: '物料匹配推荐', description: '适配生产工艺的物料推荐' },
        { name: '库存预警同步', description: '实时库存预警' },
      ],
      capabilities: ['物料与生产/工艺/设备关联解答', '采购标准精准匹配']
    },
  ],
  backendModules: [
    {
      id: 'assistant-manage',
      name: '助手中心总管理',
      icon: '🎛️',
      features: [
        { title: '部门助手创建与配置', description: '新增/停用/编辑各部门助手' },
        { title: '助手基础信息管理', description: '修改助手名称/头像/简介' },
        { title: '助手版本管理', description: '留存助手迭代版本，支持版本回滚' },
        { title: '快捷入口配置', description: '生成桌面/企业微信/钉钉/OA内嵌入口' },
      ]
    },
    {
      id: 'assistant-customize',
      name: '助手场景化定制配置',
      icon: '🎨',
      features: [
        { title: '知识域/图谱维度绑定', description: '为各部门助手绑定对应知识域+图谱核心维度' },
        { title: '快捷提问配置', description: '添加/删除/编辑高频快捷提问' },
        { title: '场景插件配置', description: '开启/关闭/配置场景插件' },
        { title: '回复风格配置', description: '专业严谨/口语化/标准化/实操性' },
      ]
    },
    {
      id: 'assistant-cross',
      name: '跨部门助手联动配置',
      icon: '🔄',
      features: [
        { title: '跨部门知识复用', description: '设置跨部门知识共享规则' },
        { title: '跨部门问答联动', description: '配置跨部门问题转接规则' },
        { title: '跨部门数据统计', description: '设置跨部门助手数据共享规则' },
      ]
    },
    {
      id: 'assistant-compliance',
      name: '助手合规与权限管控',
      icon: '🛡️',
      features: [
        { title: '助手操作权限配置', description: '按"部门+岗位"配置员工对助手的使用权限' },
        { title: '问答合规规则配置', description: '为各部门助手配置专属合规规则' },
        { title: '问答日志管理', description: '留存所有助手问答记录' },
      ]
    },
    {
      id: 'assistant-analytics',
      name: '助手运营与统计分析',
      icon: '📊',
      features: [
        { title: '全助手核心指标统计', description: '总问答次数/平均准确率/平均响应时间/用户活跃度' },
        { title: '部门助手数据独立统计', description: '各助手问答次数/准确率/插件使用率' },
        { title: '双底座赋能效果统计', description: '知识库/图谱数据在助手中的使用率' },
        { title: '制造场景专项统计', description: '故障解答准确率/选型建议使用率' },
        { title: '运营报表生成', description: '按部门/助手生成日报/周报/月报' },
        { title: '优化建议生成', description: '推荐各部门助手快捷提问/插件/知识补充方向' },
      ]
    },
  ]
};

// ==================== 系统基础管理 ====================
export const systemManagementData = {
  id: 'system-management',
  name: '系统基础管理',
  icon: '⚙️',
  description: '全平台共用，后台专属管控',
  modules: [
    {
      id: 'sys-user',
      name: '用户与组织架构管理',
      icon: '👥',
      features: [
        { title: '组织架构配置', description: '创建公司/部门/车间/岗位，支持层级调整' },
        { title: '用户账号管理', description: '新增/停用/编辑用户，配置所属部门/车间/岗位' },
        { title: '角色管理', description: '自定义角色（超级管理员/知识运营管理员/数据管理员等）' },
        { title: '权限配置', description: '为各角色配置各模块操作权限，支持权限继承' },
        { title: '登录方式管理', description: '账号密码/企业微信/钉钉/单点登录(SSO)/车间专用扫码登录' },
      ]
    },
    {
      id: 'sys-params',
      name: '系统参数全局配置',
      icon: '🔧',
      features: [
        { title: '基础参数配置', description: '产品名称/LOGO/首页展示/通知方式' },
        { title: '各模块参数配置', description: '知识库/知识图谱/助手中心的专属参数' },
        { title: '大模型参数配置', description: '统一配置回复字数/温度/TOP_K，支持各部门助手场景化微调' },
        { title: '制造企业专属参数', description: '工艺标准更新提醒/设备知识有效期/车间知识查看权限等' },
      ]
    },
    {
      id: 'sys-security',
      name: '数据安全与备份',
      icon: '🔐',
      features: [
        { title: '数据全量加密', description: '传输/存储全程加密，重点加密核心数据' },
        { title: '自动/手动备份', description: '设置按周期自动备份，支持手动触发全量/增量备份' },
        { title: '数据恢复', description: '支持按备份点恢复' },
        { title: '异地备份', description: '支持配置异地备份地址' },
      ]
    },
    {
      id: 'sys-monitor',
      name: '系统监控与告警',
      icon: '📡',
      features: [
        { title: '系统运行状态监控', description: '实时展示服务器/数据库/各模块运行状态' },
        { title: '异常告警', description: '识别系统故障/数据同步失败/违规操作，实时推送告警' },
        { title: '性能监控与优化', description: '监控系统响应速度/并发量，自动优化' },
        { title: '告警记录与复盘', description: '留存所有告警信息，支持查询/分析' },
      ]
    },
    {
      id: 'sys-log',
      name: '操作日志与审计',
      icon: '📝',
      features: [
        { title: '全平台操作日志', description: '留存所有用户在各模块的操作行为' },
        { title: '日志多维度检索', description: '按用户/部门/模块/操作类型/时间检索' },
        { title: '日志导出与审计', description: '支持日志批量导出' },
        { title: '日志清理与留存', description: '配置日志留存周期，自动清理过期日志' },
      ]
    },
    {
      id: 'sys-integration',
      name: '系统对接与集成管理',
      icon: '🔗',
      features: [
        { title: '第三方系统对接', description: '统一管理与ERP/MES/PLM/客服系统/OA/工单系统的对接接口' },
        { title: '接口权限管控', description: '配置各系统接口的访问权限/调用频率' },
        { title: '接口运行监控', description: '实时监控接口运行状态，异常时触发告警' },
        { title: '接口日志管理', description: '留存接口调用记录，支持检索' },
      ]
    },
  ]
};

// ==================== 独立产品（AI质检类） ====================
export const independentProducts = [
  {
    id: 'vision-inspection',
    name: 'AI视觉质检平台',
    icon: '👁️',
    shortDescription: '缺陷检测、装配防错、OCR、尺寸测量',
    positioning: 'AI视觉质检平台（缺陷检测、装配防错、OCR、尺寸测量）',
    industries: ['3C', '五金', '注塑', '汽配', '电子组装', '包装'],
    deployment: ['本地部署', '轻量云端Demo'],
    coreValues: [
      '实时缺陷检测，降低不良品率',
      '装配正确性验证，减少人为失误',
      'OCR识别与校验，提升追溯效率',
      '尺寸测量自动化，确保产品规格'
    ],
    gradient: 'from-green-500 via-emerald-500 to-teal-600',
    modules: [
      { id: 'vi-capture', name: '图像/视频采集接入', features: ['相机/摄像头接入配置', '图像预览、实时流显示', '图像抓拍、保存、回放', '光照、焦距、角度参数可视化调节'] },
      { id: 'vi-data', name: '数据管理与标注', features: ['样本图片上传、分类、归档', '缺陷类型自定义管理', '快速标注工具', '数据集版本管理', '数据清洗、去重、筛选'] },
      { id: 'vi-model', name: 'AI模型管理', features: ['模型训练/重训练入口', '模型版本管理', '模型精度、召回率、误检率展示', '模型推理引擎配置', '小样本快速适配'] },
      { id: 'vi-detect', name: '实时质检检测', features: ['实时缺陷检测', '装配正确性检测', 'OCR/条码/二维码识别与校验', '视觉尺寸测量', '包装/标签检测', '检测结果实时弹窗与声光告警'] },
      { id: 'vi-result', name: '结果与判定管理', features: ['OK/NG自动判定', 'NG缺陷类型自动归类', '人工复核入口', '误报反馈', '检测日志追溯'] },
      { id: 'vi-stats', name: '统计与报表', features: ['合格率趋势图', '缺陷类型占比统计', '班次/产线/产品质量对比', '日报/周报自动生成', '导出Excel/PDF'] },
      { id: 'vi-line', name: '产线协同与控制', features: ['与PLC/机械手信号对接', '产线状态监控', '异常停机记录', '质检结果同步MES/ERP'] },
      { id: 'vi-sys', name: '系统管理', features: ['用户权限', '产品型号管理', '检测规则配置', '告警阈值设置', '操作日志'] },
    ]
  },
  {
    id: 'acoustic-inspection',
    name: 'AI声学质检平台',
    icon: '🔊',
    shortDescription: '依托声音特征，实现设备异常、产品声学性能的自动检测',
    positioning: 'AI声学质检子系统（依托声音特征，实现设备异常、产品声学性能的自动检测）',
    industries: ['3C电子', '汽车零部件', '机械制造', '家电', '五金', '电机/泵阀'],
    deployment: ['本地部署（适配产线实时采集）', '轻量云端Demo'],
    coreValues: [
      '设备异响实时检测，预防设备故障',
      '产品声学性能检测，确保产品质量',
      '环境噪音监控，提升检测准确性',
      '多场景适配，满足不同声学检测需求'
    ],
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
    modules: [
      { id: 'ai-capture', name: '声学采集接入', features: ['麦克风/拾音设备接入配置', '音频实时采集、预览、流显示', '音频抓拍、保存、回放', '采样率、增益、降噪参数可视化调节', '异常音频自动触发录制'] },
      { id: 'ai-data', name: '声学数据管理与标注', features: ['音频样本上传、分类、归档', '异响类型自定义管理', '快速标注工具', '音频数据集版本管理', '音频数据清洗'] },
      { id: 'ai-model', name: 'AI声学模型管理', features: ['声学模型训练/重训练入口', '模型版本管理', '模型核心指标展示', '推理引擎配置', '场景化模型适配'] },
      { id: 'ai-detect', name: '实时声学质检', features: ['设备异响检测', '产品声学性能检测', '环境声学监控'] },
      { id: 'ai-result', name: '检测结果与判定管理', features: ['OK/NG自动判定', 'NG缺陷类型自动归类', '人工复核入口', '检测日志追溯', '异常结果声光告警'] },
      { id: 'ai-stats', name: '统计与报表', features: ['声学质检合格率趋势图', '缺陷类型占比统计', '设备异常频次统计', '日报/周报自动生成', '多维度对比分析'] },
      { id: 'ai-line', name: '产线协同与控制', features: ['与PLC/机械手信号对接', '质检结果同步至MES/ERP系统', '产线工位声学状态监控', '异常停机记录'] },
      { id: 'ai-calib', name: '声学校准与降噪', features: ['拾音设备校准', '多模式降噪', '声学基线校准'] },
      { id: 'ai-sys', name: '系统管理', features: ['用户权限管理', '产品/设备型号管理', '检测规则配置', '操作日志留存', '系统参数备份与恢复'] },
    ]
  },
  {
    id: 'behavior-recognition',
    name: 'AI智能行为识别系统',
    icon: '🚶',
    shortDescription: '实现生产现场人员行为、区域安全、设备状态的实时识别与管控',
    positioning: 'AI智能行为识别子系统（以AI算法为核心，实现生产现场人员行为、区域安全、设备状态的实时识别与管控）',
    industries: ['3C电子', '汽车零部件', '机械制造', '家电', '精密装配'],
    deployment: ['本地部署（工控机+相机+推理器）', '轻量云端Demo'],
    coreValues: [
      '解决人工巡检实时性不足痛点',
      '规范作业流程，提升产品良率',
      '实现异常毫秒级预警，保障产线安全',
      '综合识别准确率≥97%'
    ],
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    modules: [
      { id: 'br-capture', name: '视频采集与设备接入', features: ['多设备兼容接入', '实时视频流采集', '视频处理功能', '采集参数调节', '设备状态监控'] },
      { id: 'br-analysis', name: '行为识别分析', features: ['PPE穿戴识别', '操作流程识别', '人员状态识别', '操作规范识别', '危险区域侵入识别', '设备异常体征识别', '危险信号识别'] },
      { id: 'br-model', name: '模型训练与优化', features: ['深度学习模型训练', '模型适配与迭代', '识别参数配置', '模型性能监控'] },
      { id: 'br-alarm', name: '异常报警与处置', features: ['分级报警触发', '报警信息推送', '人工处置入口', '处置结果反馈', '联动控制'] },
      { id: 'br-data', name: '数据管理与追溯', features: ['识别日志留存', '样本数据管理', '视频数据归档', '数据检索功能'] },
      { id: 'br-stats', name: '统计分析与报表', features: ['违规行为统计', '识别效果统计', '操作规范统计', '多维度报表生成', '优化建议输出'] },
      { id: 'br-sys', name: '系统管理', features: ['用户权限管理', '工位/区域管理', '识别规则配置', '操作日志留存', '系统参数备份与恢复'] },
    ]
  },
  {
    id: 'intelligent-scheduling',
    name: 'AI智能排产生产系统',
    icon: '📊',
    shortDescription: '基于大模型持续学习能力，实现生产计划自动生成、动态优化',
    positioning: 'AI智能排产生产子系统（基于大模型持续学习能力，实现生产计划自动生成、动态优化、执行监控）',
    industries: ['离散制造', '流程制造', '3C电子', '汽车零部件', '机械制造', '家电'],
    deployment: ['本地部署（适配产线实时数据联动）', '轻量云端Demo'],
    coreValues: [
      '设备利用率提升15%~20%',
      '降低运营成本45%',
      '生产瓶颈可视化、风险预警',
      '快速应对订单变更、设备故障等动态场景'
    ],
    gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
    modules: [
      { id: 'is-data', name: '数据采集与系统对接', features: ['内部系统无缝对接', '全维度训练数据采集', '数据实时更新', '数据格式兼容与清洗', '数据归档与追溯'] },
      { id: 'is-model', name: '模型训练与优化', features: ['深度学习模型训练', '强化学习模型适配', '模型重训练入口', '模型性能监控', '模型参数自定义配置'] },
      { id: 'is-plan', name: '智能排产计划', features: ['多类型排产支持', '自动排产计划生成', '动态排产优化', '排产约束条件设置', '排产方案预览与对比', '排产计划下发'] },
      { id: 'is-exec', name: '计划执行与监控', features: ['排产计划实时监控', '生产瓶颈可视化', '异常实时预警与响应', '执行数据反馈', '人工干预入口'] },
      { id: 'is-resource', name: '资源管理', features: ['设备资源管理', '人力资源管理', '物料资源管理', '资源利用率统计'] },
      { id: 'is-stats', name: '统计分析与报表', features: ['生产效率统计', '成本节约统计', '订单交付统计', '瓶颈分析报表', '日报/周报/月报自动生成'] },
      { id: 'is-sys', name: '系统管理', features: ['用户权限管理', '产品/工序管理', '排产规则配置', '操作日志留存', '系统参数备份与恢复'] },
    ]
  },
];

// 产品分类
export const productCategories = [
  { id: 'main', name: '智能知识管理系统', icon: '🎯', productIds: ['knowledge-system'] },
  { id: 'quality', name: 'AI质检系统', icon: '✓', productIds: ['vision-inspection', 'acoustic-inspection'] },
  { id: 'production', name: '生产管理系统', icon: '🏭', productIds: ['behavior-recognition', 'intelligent-scheduling'] },
];
