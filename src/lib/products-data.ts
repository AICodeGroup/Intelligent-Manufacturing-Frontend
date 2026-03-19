export interface Feature {
  title: string;
  description: string;
}

export interface Module {
  id: string;
  name: string;
  description?: string;
  features: Feature[];
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  icon: string;
  shortDescription: string;
  positioning: string;
  industries: string[];
  deployment: string[];
  coreValues: string[];
  modules: Module[];
  gradient: string;
  accentColor: string;
}

export const products: Product[] = [
  {
    id: 'knowledge-base',
    name: '企业知识库',
    icon: '📚',
    shortDescription: '多模态知识接入+知识大模型，实现FAQ、文档、视频、知识图谱等多类型知识的全生命周期管理',
    positioning: '企业知识库（基于多模态知识接入+知识大模型，实现FAQ、文档、视频、知识图谱等多类型知识的全生命周期管理，打造全渠道统一知识库，支撑客服、知识运营、客户/经销商等多场景应用，解决企业知识分散、检索低效、合规缺失等痛点）',
    industries: ['各类有知识管理、客服支撑、知识运营需求的企业', '制造业', '金融业', '零售业'],
    deployment: ['本地部署（适配企业知识安全管控）', '轻量云端Demo（用于客户体验核心功能）'],
    coreValues: [
      '打破企业知识孤岛，实现多模态知识统一管理',
      '提升知识检索效率，降低人工依赖',
      '建立完善合规审查机制，降低泄密与合规风险',
      '支持多语言适配，满足全球业务需求',
      '支撑客服、运营等多场景应用，降低培训成本、提升工作效率',
      '实现知识从"重建设"到"重运营"的转型'
    ],
    gradient: 'from-blue-500 via-indigo-500 to-purple-600',
    accentColor: 'blue',
    modules: [
      {
        id: 'multi-modal-input',
        name: '多模态知识接入模块',
        description: '核心基础，解决知识分散痛点',
        color: 'blue',
        features: [
          { title: '多类型知识接入', description: '支持FAQ、文档、视频、网页、链接等多模态知识，覆盖附件提及的所有知识类型' },
          { title: '多渠道接入方式', description: '支持文件导入、手动录入、网页采集、系统对接、API接口同步，实现"单点维护，多点发布"' },
          { title: '业务系统联动接入', description: '对接企业客服系统、ERP、MES等业务系统，同步业务相关知识，打破数据孤岛' },
          { title: '知识批量导入', description: '支持多文件批量上传、批量录入，提升知识接入效率，降低人工成本' },
          { title: '接入格式兼容', description: '支持文档、视频、表格、图片等多种格式，自动适配解析，无需手动转换' }
        ]
      },
      {
        id: 'knowledge-processing',
        name: '知识处理与萃取模块',
        description: '核心技术，提升知识质量',
        color: 'indigo',
        features: [
          { title: '知识自动萃取', description: '基于知识大模型，自动从文档、视频等多模态数据中萃取核心知识，生成结构化内容' },
          { title: '知识分类整理', description: '自动对导入的知识按主题、场景、类型分类，也支持手动分类，便于后续检索' },
          { title: '知识标准化处理', description: '统一知识格式、语言规范，解决多渠道答案矛盾问题，提升知识一致性' },
          { title: '知识去重与优化', description: '自动识别重复知识，提醒用户合并/删除，优化知识质量，降低维护成本' },
          { title: '知识模板适配', description: '提供多种知识模板，支持用户按模板录入知识，规范知识录入流程' }
        ]
      },
      {
        id: 'knowledge-storage',
        name: '知识存储与管理模块',
        description: '核心业务，实现全生命周期管理',
        color: 'purple',
        features: [
          { title: '知识空间管理', description: '支持创建主题库、常用语库等多种知识空间，分类存储知识，适配不同业务场景' },
          { title: '知识全生命周期管控', description: '覆盖知识采集、处理、发布、更新、归档、删除全流程，实现闭环管理' },
          { title: '知识版本管理', description: '留存知识不同版本，支持版本切换、回溯，便于知识更新与复盘' },
          { title: '知识手动编辑', description: '支持对知识内容、分类、属性进行手动编辑、修改，提升知识灵活性' },
          { title: '知识归档与清理', description: '自动对过期知识提醒归档，支持手动清理无效知识，保持知识库整洁' }
        ]
      },
      {
        id: 'knowledge-search',
        name: '知识检索与交互模块',
        description: '核心应用，解决检索低效痛点',
        color: 'cyan',
        features: [
          { title: '智能检索功能', description: '支持关键词检索、自然语言检索，快速定位所需知识，提升检索效率，摆脱人工依赖' },
          { title: '检索优化', description: '支持模糊检索、关联检索，自动推荐相关知识，解决"找不到、找不全"问题' },
          { title: '知识问答交互', description: '基于知识大模型，支持自然语言问答，快速响应用户知识咨询，适配客服、员工查询场景' },
          { title: '检索历史与收藏', description: '自动留存检索历史，支持知识收藏，便于后续快速查阅' },
          { title: '知识门户展示', description: '搭建统一知识门户，直观展示各类知识，便于用户快速浏览、获取知识' }
        ]
      },
      {
        id: 'compliance-security',
        name: '合规审查与安全模块',
        description: '核心诉求，解决合规缺失痛点',
        color: 'red',
        features: [
          { title: '精细化权限管控', description: '按角色、岗位分级授权，控制知识查看、编辑、发布权限，防止知识越权泄密' },
          { title: '知识时效性审查', description: '设置知识有效期，到期自动提醒更新，解决知识更新延迟问题' },
          { title: '大模型回复幻觉控制', description: '建立幻觉校验机制，确保知识问答准确性，降低合规风险' },
          { title: '知识反馈渠道', description: '提供知识纠错、反馈入口，及时优化错误知识，保障知识质量' },
          { title: '内外知识库隔离', description: '区分对内、对外知识库，避免内部核心知识外泄，规范知识库管理' }
        ]
      },
      {
        id: 'multi-language',
        name: '多语言适配模块',
        description: '核心诉求，解决多语言适配差痛点',
        color: 'green',
        features: [
          { title: '多语言自动翻译', description: '基于知识大模型，实现多语言知识自动翻译，保证翻译质量，避免内容生硬' },
          { title: '多语种知识库构建', description: '支持创建多语种知识，确保不同语种知识的时效性与一致性' },
          { title: '语言自动适配', description: '根据用户使用语言，自动展示对应语种知识内容，适配全球业务需求' },
          { title: '小语种支持', description: '适配全球小语种，填补小语种知识库缺失空白' }
        ]
      },
      {
        id: 'knowledge-application',
        name: '知识应用与集成模块',
        description: '核心落地，支撑多场景需求',
        color: 'orange',
        features: [
          { title: '客服场景集成', description: '与客户智能坐席助手、客服机器人无缝对接，支撑客服全场景应用，提升响应速度' },
          { title: '业务系统集成', description: '通过API接口，将知识库同步到各业务渠道与系统，实现"单点维护，多点发布"' },
          { title: '知识互动功能', description: '支持用户对知识进行评论、点赞、分享，促进知识流转与优化' },
          { title: 'Agent智能应用', description: '对接Agent工具，实现知识的智能化应用与主动推送' },
          { title: '客户/经销商场景适配', description: '为客户、经销商提供专属知识入口，便于其快速获取所需知识' }
        ]
      },
      {
        id: 'statistics-operation',
        name: '统计分析与运营模块',
        description: '核心支撑，实现"重运营"转型',
        color: 'pink',
        features: [
          { title: '知识运营统计', description: '统计知识接入量、更新频率、检索次数、问答次数，衡量知识有效性' },
          { title: '用户行为分析', description: '分析用户检索习惯、知识偏好，为知识优化、推送提供依据' },
          { title: '知识质量评估', description: '自动评估知识准确率、实用性，提醒运营人员优化低质量知识' },
          { title: '多维度报表生成', description: '自动生成日报/周报/月报，汇总知识运营、合规、应用等核心数据，支持Excel/PDF导出' },
          { title: '运营优化建议', description: '基于统计数据，提供知识更新、分类优化、检索优化等建议，辅助运营决策' }
        ]
      },
      {
        id: 'system-management',
        name: '系统管理模块',
        description: '通用适配，便于运维',
        color: 'gray',
        features: [
          { title: '用户权限管理', description: '管理员、知识运营人员、客服、普通员工分级授权，明确操作范围' },
          { title: '系统参数配置', description: '自定义知识接入规则、检索参数、合规审查标准等，适配企业需求' },
          { title: '数据安全管理', description: '支持知识加密、操作日志留存，保障知识安全，便于追溯' },
          { title: '系统备份与恢复', description: '定期备份知识库数据、配置参数，支持一键恢复，避免数据丢失' },
          { title: '系统状态监控', description: '实时监测系统运行、知识接入、检索响应等状态，异常时自动告警' }
        ]
      }
    ]
  },
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
    accentColor: 'green',
    modules: [
      {
        id: 'image-capture',
        name: '图像/视频采集接入',
        color: 'green',
        features: [
          { title: '相机/摄像头接入配置', description: '支持多种工业相机和普通摄像头接入' },
          { title: '图像预览、实时流显示', description: '实时查看采集画面，监控检测过程' },
          { title: '图像抓拍、保存、回放', description: '支持图像抓拍存储和历史回放' },
          { title: '光照、焦距、角度参数可视化调节', description: '可视化调整采集参数，优化图像质量' }
        ]
      },
      {
        id: 'data-management',
        name: '数据管理与标注',
        color: 'emerald',
        features: [
          { title: '样本图片上传、分类、归档', description: '系统化管理检测样本数据' },
          { title: '缺陷类型自定义管理', description: '灵活定义缺陷类别和判定标准' },
          { title: '快速标注工具', description: '框选、点选、缺陷标记等便捷标注功能' },
          { title: '数据集版本管理', description: '管理不同版本的数据集，支持版本回溯' },
          { title: '数据清洗、去重、筛选', description: '自动清洗冗余数据，提升数据质量' }
        ]
      },
      {
        id: 'ai-model-management',
        name: 'AI模型管理',
        color: 'teal',
        features: [
          { title: '模型训练/重训练入口', description: '支持模型训练和持续优化' },
          { title: '模型版本管理', description: '管理不同版本的检测模型' },
          { title: '模型精度、召回率、误检率展示', description: '直观展示模型性能指标' },
          { title: '模型推理引擎配置', description: '配置推理引擎参数，优化检测效率' },
          { title: '小样本快速适配', description: 'Demo亮点：快速适配新检测场景' }
        ]
      },
      {
        id: 'real-time-inspection',
        name: '实时质检检测',
        description: '核心功能',
        color: 'blue',
        features: [
          { title: '实时缺陷检测', description: '划痕、脏污、变形、缺料、毛刺等缺陷自动检测' },
          { title: '装配正确性检测', description: '漏装、错装、反装、少件等装配异常识别' },
          { title: 'OCR/条码/二维码识别与校验', description: '自动识别并校验产品标识信息' },
          { title: '视觉尺寸测量', description: '长、宽、直径、间距等尺寸自动测量' },
          { title: '包装/标签检测', description: '歪标、漏标、封口不良等包装缺陷检测' },
          { title: '检测结果实时弹窗与声光告警', description: '发现异常立即告警，及时处理' }
        ]
      },
      {
        id: 'result-management',
        name: '结果与判定管理',
        color: 'orange',
        features: [
          { title: 'OK/NG自动判定', description: '基于检测规则自动判定产品合格状态' },
          { title: 'NG缺陷类型自动归类', description: '自动分类缺陷类型，便于统计分析' },
          { title: '人工复核入口', description: '支持人工复核检测结果，提高准确性' },
          { title: '误报反馈', description: '用于模型迭代优化' },
          { title: '检测日志追溯', description: '完整记录检测过程，支持追溯查询' }
        ]
      },
      {
        id: 'statistics-report',
        name: '统计与报表',
        color: 'purple',
        features: [
          { title: '合格率趋势图', description: '直观展示产品质量趋势变化' },
          { title: '缺陷类型占比统计', description: '分析主要缺陷类型，针对性改进' },
          { title: '班次/产线/产品质量对比', description: '多维度对比分析质检效果' },
          { title: '日报/周报自动生成', description: '自动生成质检统计报表' },
          { title: '导出Excel/PDF', description: '支持多种格式导出' }
        ]
      },
      {
        id: 'production-coordination',
        name: '产线协同与控制',
        color: 'indigo',
        features: [
          { title: '与PLC/机械手信号对接', description: '剔除、停机等操作联动' },
          { title: '产线状态监控', description: '实时监控产线运行状态' },
          { title: '异常停机记录', description: '记录异常停机事件' },
          { title: '质检结果同步MES/ERP', description: '质检数据同步至生产管理系统' }
        ]
      },
      {
        id: 'system-config',
        name: '系统管理',
        color: 'gray',
        features: [
          { title: '用户权限', description: '管理员/质检员/工程师分级授权' },
          { title: '产品型号管理', description: '管理检测产品型号和参数' },
          { title: '检测规则配置', description: '自定义检测规则和判定标准' },
          { title: '告警阈值设置', description: '设置各类告警的触发阈值' },
          { title: '操作日志', description: '完整记录系统操作行为' }
        ]
      }
    ]
  },
  {
    id: 'acoustic-inspection',
    name: 'AI声学质检平台',
    icon: '🔊',
    shortDescription: '依托声音特征，实现设备异常、产品声学性能的自动检测',
    positioning: 'AI声学质检子系统（依托声音特征，实现设备异常、产品声学性能的自动检测，可与视觉质检系统联动）',
    industries: ['3C电子', '汽车零部件', '机械制造', '家电', '五金', '电机/泵阀等'],
    deployment: ['本地部署（适配产线实时采集）', '轻量云端Demo（用于客户体验）'],
    coreValues: [
      '设备异响实时检测，预防设备故障',
      '产品声学性能检测，确保产品质量',
      '环境噪音监控，提升检测准确性',
      '多场景适配，满足不同声学检测需求'
    ],
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
    accentColor: 'purple',
    modules: [
      {
        id: 'acoustic-capture',
        name: '声学采集接入',
        description: '核心基础模块',
        color: 'purple',
        features: [
          { title: '麦克风/拾音设备接入配置', description: '支持单/多麦克风联动，适配产线不同工位' },
          { title: '音频实时采集、预览、流显示', description: '支持16bit/24bit采样，适配不同声学场景' },
          { title: '音频抓拍、保存、回放', description: '可关联产线工位、产品型号，便于追溯' },
          { title: '采样率、增益、降噪参数可视化调节', description: '适配不同环境噪音场景' },
          { title: '异常音频自动触发录制', description: '检测到异响时，自动留存原始音频，用于模型迭代' }
        ]
      },
      {
        id: 'acoustic-data-management',
        name: '声学数据管理与标注',
        description: '模型迭代基础',
        color: 'violet',
        features: [
          { title: '音频样本上传、分类、归档', description: '按"正常音频/异常音频""缺陷类型"分类管理' },
          { title: '异响类型自定义管理', description: '可添加轴承异响、齿轮异响、杂音、漏音等自定义类型' },
          { title: '快速标注工具', description: '音频片段截取、异响时间段标记、缺陷类型标注' },
          { title: '音频数据集版本管理', description: '标注记录留存、版本回溯，支持模型重训练' },
          { title: '音频数据清洗', description: '去噪、去冗余、筛选有效样本，提升模型精度' }
        ]
      },
      {
        id: 'acoustic-model',
        name: 'AI声学模型管理',
        description: '核心技术模块',
        color: 'fuchsia',
        features: [
          { title: '声学模型训练/重训练入口', description: '支持小样本适配，Demo重点突出"快速适配新场景"' },
          { title: '模型版本管理', description: '版本切换、历史版本回溯，避免训练失误' },
          { title: '模型核心指标展示', description: '识别准确率、召回率、误检率、响应速度，直观展示效果' },
          { title: '推理引擎配置', description: '适配不同音频格式、采样率，保障实时检测响应' },
          { title: '场景化模型适配', description: '可切换"设备检测""产品检测"专用模型，按需调用' }
        ]
      },
      {
        id: 'realtime-acoustic-inspection',
        name: '实时声学质检',
        description: '核心业务模块，分3大场景',
        color: 'blue',
        features: [
          { title: '设备异响检测', description: '电机、轴承、齿轮、泵阀等设备异响实时检测，分级告警' },
          { title: '产品声学性能检测', description: '发声产品一致性检测、杂音/漏音检测、声学参数达标校验' },
          { title: '环境声学监控', description: '产线环境噪音实时监测、噪音源初步定位、环境噪音补偿' }
        ]
      },
      {
        id: 'acoustic-result',
        name: '检测结果与判定管理',
        description: '衔接产线落地',
        color: 'orange',
        features: [
          { title: 'OK/NG自动判定', description: '基于声学模型，实时输出判定结果' },
          { title: 'NG缺陷类型自动归类', description: '按异响类型、杂音等级等分类，便于统计分析' },
          { title: '人工复核入口', description: '支持音频回放、重新判定，误报/漏报可反馈至模型' },
          { title: '检测日志追溯', description: '关联产品ID、工位、检测时间、音频文件，全程可追溯' },
          { title: '异常结果声光告警', description: '现场弹窗+声音提醒，及时通知质检员处理' }
        ]
      },
      {
        id: 'acoustic-statistics',
        name: '统计与报表',
        description: '老板/管理者关注',
        color: 'pink',
        features: [
          { title: '声学质检合格率趋势图', description: '按班次、产线、产品型号展示' },
          { title: '缺陷类型占比统计', description: '如设备异响类型占比、产品杂音占比' },
          { title: '设备异常频次统计', description: '辅助设备维护计划制定' },
          { title: '日报/周报自动生成', description: '声学质检核心数据汇总，支持Excel/PDF导出' },
          { title: '多维度对比分析', description: '不同产线、不同时间段质检效果对比' }
        ]
      },
      {
        id: 'acoustic-production',
        name: '产线协同与控制',
        description: '适配产线实际运行',
        color: 'indigo',
        features: [
          { title: '与PLC/机械手信号对接', description: '检测到NG时，触发剔除、停机指令' },
          { title: '质检结果同步至MES/ERP系统', description: '与视觉质检结果联动，形成完整质检数据' },
          { title: '产线工位声学状态监控', description: '实时展示各工位采集设备运行状态' },
          { title: '异常停机记录', description: '关联声学检测结果，便于追溯停机原因' }
        ]
      },
      {
        id: 'acoustic-calibration',
        name: '声学校准与降噪',
        color: 'cyan',
        features: [
          { title: '拾音设备校准', description: '定期校准麦克风，保证采集精度' },
          { title: '多模式降噪', description: '静态降噪、动态降噪，适配不同产线环境' },
          { title: '声学基线校准', description: '手动/自动校准正常声音基线，减少误报' }
        ]
      },
      {
        id: 'acoustic-system',
        name: '系统管理',
        color: 'gray',
        features: [
          { title: '用户权限管理', description: '管理员、质检员、工程师分级授权，限制操作范围' },
          { title: '产品/设备型号管理', description: '添加、编辑、删除，关联对应声学标准' },
          { title: '检测规则配置', description: '调整告警阈值、判定标准，适配不同场景' },
          { title: '操作日志留存', description: '记录所有操作行为，便于运维排查' },
          { title: '系统参数备份与恢复', description: '保障数据安全，避免配置丢失' }
        ]
      }
    ]
  },
  {
    id: 'behavior-recognition',
    name: 'AI智能行为识别系统',
    icon: '🚶',
    shortDescription: '以AI算法为核心，实现生产现场人员行为、区域安全、设备状态、操作流程的实时识别与管控',
    positioning: 'AI智能行为识别子系统（以AI算法为核心，实现生产现场人员行为、区域安全、设备状态、操作流程的实时识别与管控，无需改造现有设备/产线，实现生产流程零干预、生产节拍零扰动）',
    industries: ['3C电子', '汽车零部件', '机械制造', '家电', '精密装配等各类制造业生产场景'],
    deployment: ['本地部署（工控机+相机+推理器，适配产线实时采集）', '轻量云端Demo（用于客户体验识别效果）'],
    coreValues: [
      '解决人工巡检实时性不足、数据追溯困难等痛点',
      '规范作业流程，减少不规范操作导致的产品缺陷，提升产品良率',
      '实现异常毫秒级预警，保障产线安全',
      '优化人员配置，降低运营成本',
      '数据驱动决策，为生产管理提供精准支撑',
      '综合识别准确率≥97%'
    ],
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    accentColor: 'orange',
    modules: [
      {
        id: 'video-capture',
        name: '视频采集与设备接入模块',
        description: '核心基础，支撑识别精准度',
        color: 'orange',
        features: [
          { title: '多设备兼容接入', description: '支持各类工业相机、普通摄像头，适配相机+推理器组合模式，无需改造现有产线设备' },
          { title: '实时视频流采集', description: '覆盖流水线工位、危险区域、设备操作区，支持多工位、多区域同时采集，无卡顿' },
          { title: '视频处理功能', description: '支持视频截图、实时预览、回放，可关联时间、工位信息，便于后续追溯' },
          { title: '采集参数调节', description: '可视化调节相机焦距、角度、曝光度，适配不同生产环境光线、工位布局' },
          { title: '设备状态监控', description: '实时监测相机、推理器、报警器运行状态，异常时自动告警，保障系统稳定' }
        ]
      },
      {
        id: 'behavior-analysis',
        name: '行为识别分析模块',
        description: '核心业务，贴合解决方案场景',
        color: 'red',
        features: [
          { title: 'PPE穿戴识别', description: '实时检测作业人员安全帽、工服、手指套、静电环等穿戴情况' },
          { title: '操作流程识别', description: '实时追踪装配顺序、关键动作节点，识别漏操作、误操作、操作超时/停滞异常' },
          { title: '人员状态识别', description: '识别离岗、串岗、睡岗、异常聚集、斗殴等行为' },
          { title: '操作规范识别', description: '识别吸球取屏、撕膜、按压、贴附等具体操作是否符合标准' },
          { title: '危险区域侵入识别', description: '实时监测高危区域，人员违规侵入时立即触发预警' },
          { title: '设备异常体征识别', description: '解析多源传感数据，精准识别设备运行异常' },
          { title: '危险信号识别', description: '实时检测火焰、烟雾等危险信号，快速触发安全预警' }
        ]
      },
      {
        id: 'model-training',
        name: '模型训练与优化模块',
        description: '核心技术，保障识别精度',
        color: 'rose',
        features: [
          { title: '深度学习模型训练', description: '基于海量行为样本、违规案例，训练识别模型，提升识别准确率' },
          { title: '模型适配与迭代', description: '支持小样本学习，可导入新的操作场景、违规案例，手动触发模型重训练' },
          { title: '识别参数配置', description: '可自定义识别阈值、违规判定标准，适配不同企业操作规范' },
          { title: '模型性能监控', description: '展示识别准确率、误报率、响应速度等核心指标' }
        ]
      },
      {
        id: 'alarm-handling',
        name: '异常报警与处置模块',
        color: 'amber',
        features: [
          { title: '分级报警触发', description: '根据违规严重程度，触发毫秒级声光报警' },
          { title: '报警信息推送', description: '异常报警同步推送至管理人员手机、客户端' },
          { title: '人工处置入口', description: '支持管理人员接收报警、查看违规现场视频，手动确认处置结果' },
          { title: '处置结果反馈', description: '记录违规处置情况，形成处置闭环，用于模型优化' },
          { title: '联动控制', description: '严重违规时，可联动产线PLC/机械手，触发停机、剔除等操作' }
        ]
      },
      {
        id: 'data-traceability',
        name: '数据管理与追溯模块',
        color: 'blue',
        features: [
          { title: '识别日志留存', description: '自动记录所有识别结果、违规行为、报警信息、处置记录' },
          { title: '样本数据管理', description: '上传、分类、归档违规行为样本，用于模型重训练' },
          { title: '视频数据归档', description: '留存违规现场视频、操作视频，关联违规记录' },
          { title: '数据检索功能', description: '支持按时间、工位、违规类型、处置状态检索' }
        ]
      },
      {
        id: 'behavior-statistics',
        name: '统计分析与报表模块',
        color: 'purple',
        features: [
          { title: '违规行为统计', description: '按违规类型、工位、时间段统计违规频次' },
          { title: '识别效果统计', description: '展示识别准确率、误报率、报警响应时间' },
          { title: '操作规范统计', description: '统计各工位操作合规率，对比不同班组、时间段合规情况' },
          { title: '多维度报表生成', description: '自动生成日报/周报/月报，支持Excel/PDF导出' },
          { title: '优化建议输出', description: '基于统计数据，分析生产管理痛点，提供优化建议' }
        ]
      },
      {
        id: 'behavior-system',
        name: '系统管理模块',
        color: 'gray',
        features: [
          { title: '用户权限管理', description: '管理员、安全员、班组长、操作工分级授权' },
          { title: '工位/区域管理', description: '添加、编辑、删除监控工位、危险区域' },
          { title: '识别规则配置', description: '自定义违规判定标准、报警阈值、联动控制逻辑' },
          { title: '操作日志留存', description: '记录所有系统操作、参数调整、报警处置行为' },
          { title: '系统参数备份与恢复', description: '保障数据安全，支持一键恢复' }
        ]
      }
    ]
  },
  {
    id: 'intelligent-scheduling',
    name: 'AI智能排产生产系统',
    icon: '📊',
    shortDescription: '基于大模型持续学习能力，实现生产计划自动生成、动态优化、执行监控',
    positioning: 'AI智能排产生产子系统（基于大模型持续学习能力，实现生产计划自动生成、动态优化、执行监控，可与MES/ERP/WMS/APS系统联动）',
    industries: ['离散制造', '流程制造', '3C电子', '汽车零部件', '机械制造', '家电等各类需要生产排产的制造业场景'],
    deployment: ['本地部署（适配产线实时数据联动）', '轻量云端Demo（用于客户体验排产效果）'],
    coreValues: [
      '通过大模型持续学习与动态优化，解决静态计划适配性差、排产复杂等痛点',
      '优化资源配置，设备利用率提升15%~20%，减少生产瓶颈',
      '降低运营成本45%，减少加班、物料浪费',
      '实现生产瓶颈可视化、风险预警，提升决策敏捷性',
      '快速应对订单变更、设备故障等动态场景'
    ],
    gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
    accentColor: 'cyan',
    modules: [
      {
        id: 'data-collection',
        name: '数据采集与系统对接模块',
        color: 'cyan',
        features: [
          { title: '内部系统无缝对接', description: '兼容ERP、WMS、APS、MES系统，自动同步订单、库存、生产执行等数据' },
          { title: '全维度训练数据采集', description: '订单数据、班组数据、机器任务数据、工艺数据、产能数据、历史生产数据等' },
          { title: '数据实时更新', description: '订单变更、设备故障、物料延迟等动态数据实时采集' },
          { title: '数据格式兼容与清洗', description: '支持多种数据格式，自动完成数据去重、纠错、补全' },
          { title: '数据归档与追溯', description: '采集的所有数据按时间、产品、工位分类归档' }
        ]
      },
      {
        id: 'scheduling-model',
        name: '模型训练与优化模块',
        color: 'blue',
        features: [
          { title: '深度学习模型训练', description: '基于海量生产数据、历史排产案例，训练排产模型' },
          { title: '强化学习模型适配', description: '通过实时执行反馈数据，持续优化模型性能' },
          { title: '模型重训练入口', description: '支持导入新的生产数据、排产案例，手动触发模型重训练' },
          { title: '模型性能监控', description: '展示模型排产准确率、计划适配率等核心指标' },
          { title: '模型参数自定义配置', description: '可根据企业生产特点，调整模型优化方向' }
        ]
      },
      {
        id: 'intelligent-scheduling-plan',
        name: '智能排产计划模块',
        color: 'indigo',
        features: [
          { title: '多类型排产支持', description: '适配离散、流程等几十大类、数百小类生产场景' },
          { title: '自动排产计划生成', description: '基于订单需求、产能数据、设备状态，自动生成最优生产订单/工序计划' },
          { title: '动态排产优化', description: '实时响应生产异常，自动调整排产计划' },
          { title: '排产约束条件设置', description: '可自定义产能上限、设备负荷、人员排班、物料供应等约束条件' },
          { title: '排产方案预览与对比', description: '生成多种排产方案，支持预览、对比，手动选择最优方案' },
          { title: '排产计划下发', description: '自动将排产结果输出至调度系统、MES系统' }
        ]
      },
      {
        id: 'plan-execution',
        name: '计划执行与监控模块',
        color: 'purple',
        features: [
          { title: '排产计划实时监控', description: '可视化展示各订单、工序的执行进度' },
          { title: '生产瓶颈可视化', description: '自动识别生产瓶颈工位、工序，标注瓶颈原因' },
          { title: '异常实时预警与响应', description: '设备故障、物料短缺、工序延误等异常自动告警' },
          { title: '执行数据反馈', description: '自动采集生产执行数据，同步至模型，用于模型迭代优化' },
          { title: '人工干预入口', description: '支持手动调整排产计划、暂停/重启工序' }
        ]
      },
      {
        id: 'resource-management',
        name: '资源管理模块',
        color: 'green',
        features: [
          { title: '设备资源管理', description: '实时监控设备运行状态、负荷情况，优化设备分配' },
          { title: '人力资源管理', description: '结合班组数据、工序需求，优化人员排班' },
          { title: '物料资源管理', description: '对接WMS系统，同步物料库存，根据排产计划提前预警物料短缺' },
          { title: '资源利用率统计', description: '自动统计设备、人力、物料的利用率，生成优化建议' }
        ]
      },
      {
        id: 'scheduling-statistics',
        name: '统计分析与报表模块',
        color: 'pink',
        features: [
          { title: '生产效率统计', description: '展示设备利用率、生产产能、工序完成率' },
          { title: '成本节约统计', description: '自动计算因排产优化减少的加班、物料浪费等成本' },
          { title: '订单交付统计', description: '展示订单交付准时率、延期率，分析延期原因' },
          { title: '瓶颈分析报表', description: '定期生成生产瓶颈分析报告，提供优化方向' },
          { title: '日报/周报/月报自动生成', description: '汇总排产、执行、效率、成本等核心数据，支持Excel/PDF导出' }
        ]
      },
      {
        id: 'scheduling-system',
        name: '系统管理模块',
        color: 'gray',
        features: [
          { title: '用户权限管理', description: '管理员、计划员、班组长、操作工分级授权' },
          { title: '产品/工序管理', description: '添加、编辑、删除产品型号、生产工序' },
          { title: '排产规则配置', description: '自定义排产优先级、约束条件、预警阈值' },
          { title: '操作日志留存', description: '记录所有排产操作、系统操作' },
          { title: '系统参数备份与恢复', description: '保障数据安全，支持一键恢复' }
        ]
      }
    ]
  },
  {
    id: 'knowledge-graph',
    name: '知识图谱平台',
    icon: '🕸️',
    shortDescription: '连接企业多源异构数据源，通过深度学习NLP算法，实现数据整合、图谱构建、知识问答、辅助决策',
    positioning: '知识图谱平台（连接企业多源异构数据源，通过深度学习NLP算法，实现数据整合、图谱构建、知识问答、辅助决策，打造企业知识服务中台）',
    industries: ['制造业', '金融业', '零售业等各类有异构数据整合、智能决策需求的企业'],
    deployment: ['本地部署（适配企业内部异构数据安全管理）', '轻量云端Demo（用于客户体验核心功能）'],
    coreValues: [
      '打通企业数据隔离，整合多源异构数据形成统一视图',
      '全方位挖掘数据业务价值',
      '通过可视化图谱构建，降低图谱搭建成本',
      '支撑企业知识问答、查询推荐等场景，提升业务能力',
      '搭建专家系统，辅助人工决策，提升企业智慧化水平',
      '释放员工工作价值'
    ],
    gradient: 'from-pink-500 via-rose-500 to-red-600',
    accentColor: 'pink',
    modules: [
      {
        id: 'data-integration',
        name: '数据接入与整合模块',
        color: 'pink',
        features: [
          { title: '多源异构数据接入', description: '支持企业内部ERP、MES、WMS等系统数据，以及文档、表格、图片等异构数据接入' },
          { title: '数据上传功能', description: '支持用户手动上传各类格式数据' },
          { title: '数据格式兼容', description: '支持多种数据格式，自动适配不同来源、不同类型的数据' },
          { title: '数据清洗与整合', description: '自动完成数据去重、纠错、补全，将异构数据整合为统一视图' },
          { title: '数据实时同步', description: '支持数据源实时更新，确保图谱数据与企业业务数据同步' }
        ]
      },
      {
        id: 'data-annotation',
        name: '数据标注与模型训练模块',
        color: 'rose',
        features: [
          { title: '数据标注工具', description: '提供便捷的手动标注功能，支持对上传数据进行分类、标记' },
          { title: '标注规则配置', description: '可自定义标注标准、标签类型' },
          { title: '深度学习NLP模型训练', description: '基于标注数据、企业业务数据，训练专属知识图谱模型' },
          { title: '自定义模型构建', description: '支持用户根据业务需求，自定义模型训练逻辑、参数配置' },
          { title: '模型重训练与迭代', description: '支持导入新数据、新标注案例，手动触发模型重训练' },
          { title: '模型性能监控', description: '展示模型训练精度、识别准确率等核心指标' }
        ]
      },
      {
        id: 'graph-construction',
        name: '知识图谱构建模块',
        color: 'red',
        features: [
          { title: '可视化图谱搭建', description: '提供拖拽式、可视化操作界面，无需专业技术，即可快速构建知识图谱' },
          { title: '图谱自定义配置', description: '支持用户自定义图谱结构、节点关系、属性信息' },
          { title: '图谱自动生成', description: '基于训练好的模型，自动解析整合后的数据，生成结构化知识图谱' },
          { title: '图谱编辑功能', description: '支持手动编辑图谱节点、关系，添加/删除属性' },
          { title: '图谱可视化展示', description: '以图形化方式呈现数据关联关系，清晰直观' }
        ]
      },
      {
        id: 'qa-interaction',
        name: '知识问答与交互模块',
        color: 'orange',
        features: [
          { title: '自然语言问答', description: '支持用户以自然语言提问，系统快速解析问题，从知识图谱中检索答案' },
          { title: '多场景问答适配', description: '适配企业咨询、业务查询、知识推荐等各类应用场景' },
          { title: '问答历史记录', description: '自动留存用户问答记录，支持检索、回放' },
          { title: '智能推荐功能', description: '基于用户查询习惯、业务需求，智能推荐相关知识、数据' },
          { title: '问答反馈优化', description: '支持用户对问答结果进行评价、反馈，用于模型迭代' }
        ]
      },
      {
        id: 'decision-support',
        name: '辅助决策模块',
        color: 'amber',
        features: [
          { title: '多维数据整合分析', description: '整合知识图谱中的多维度数据，进行深度挖掘' },
          { title: '专家系统搭建', description: '基于知识图谱，搭建企业专属专家系统' },
          { title: '决策建议生成', description: '结合企业业务场景，基于图谱数据，自动生成合理化决策建议' },
          { title: '决策过程追溯', description: '记录决策依据、数据来源，便于后续追溯、复盘' },
          { title: '业务场景适配', description: '适配企业生产管理、经营决策、风险管控等多场景决策需求' }
        ]
      },
      {
        id: 'graph-data-management',
        name: '数据管理与追溯模块',
        color: 'blue',
        features: [
          { title: '数据归档管理', description: '将接入的数据、标注数据、图谱数据、问答记录等按类别归档' },
          { title: '数据检索功能', description: '支持按关键词、数据类型、时间等多维度检索' },
          { title: '图谱版本管理', description: '留存图谱不同版本，支持版本切换、回溯' },
          { title: '操作日志留存', description: '记录所有系统操作、数据上传、模型训练、图谱编辑行为' }
        ]
      },
      {
        id: 'graph-statistics',
        name: '统计分析与报表模块',
        color: 'purple',
        features: [
          { title: '数据价值分析', description: '统计数据接入量、图谱节点数量、问答准确率等核心指标' },
          { title: '业务场景统计', description: '统计不同业务场景的图谱使用频率、问答次数' },
          { title: '多维度报表生成', description: '自动生成日报/周报/月报，支持Excel/PDF导出' },
          { title: '优化建议输出', description: '基于统计数据，分析平台应用痛点，提供优化建议' }
        ]
      },
      {
        id: 'graph-system',
        name: '系统管理模块',
        color: 'gray',
        features: [
          { title: '用户权限管理', description: '管理员、业务人员、技术人员分级授权' },
          { title: '系统参数配置', description: '自定义数据接入规则、模型训练参数、图谱展示样式等' },
          { title: '数据安全管理', description: '支持数据加密、权限管控，保障企业异构数据、图谱数据的安全性' },
          { title: '系统备份与恢复', description: '定期备份系统数据、配置参数，支持一键恢复' },
          { title: '系统状态监控', description: '实时监测系统运行状态、数据接入状态、模型运行状态' }
        ]
      }
    ]
  }
];

export const productCategories = [
  { id: 'all', name: '全部产品', icon: '🎯' },
  { id: 'knowledge', name: '知识管理', icon: '📚', productIds: ['knowledge-base', 'knowledge-graph'] },
  { id: 'quality', name: '质检系统', icon: '✓', productIds: ['vision-inspection', 'acoustic-inspection'] },
  { id: 'production', name: '生产管理', icon: '🏭', productIds: ['behavior-recognition', 'intelligent-scheduling'] },
];
