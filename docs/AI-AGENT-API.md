# AI Agent 集成指南

## 概述
本文档说明如何在企业产品矩阵展示系统中集成AI Agent功能。

## 预留功能接口

### 1. AI 智能助手 (Chat Agent)

**功能描述**：自然语言查询产品功能

**接口位置**：`src/components/AIFunctionPanel.tsx`

**集成方式**：
```typescript
// 修改 handleSend 函数，接入真实的AI API
const handleSend = async () => {
  if (!inputValue.trim()) return;

  const userMessage = {
    id: Date.now().toString(),
    type: 'user',
    content: inputValue,
    timestamp: new Date(),
  };

  setMessages([...messages, userMessage]);
  setInputValue('');
  setIsTyping(true);

  // TODO: 调用真实的AI API
  // const response = await fetch('/api/ai/chat', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     message: inputValue,
  //     productContext: { name: productName, modules: currentProduct.modules }
  //   })
  // });

  // 模拟响应（替换为真实API调用）
  setTimeout(() => {
    const aiResponse = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: `AI回复内容...`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  }, 1500);
};
```

**API 接口设计**：
```typescript
// POST /api/ai/chat
{
  message: string;          // 用户问题
  productId: string;        // 当前产品ID
  context?: {               // 上下文信息
    moduleName?: string;    // 当前模块名称
    featureName?: string;   // 当前功能名称
  }
}

// Response
{
  success: boolean;
  data: {
    answer: string;         // AI回答
    suggestions?: string[]; // 相关建议
    relatedFeatures?: {     // 相关功能
      moduleId: string;
      featureId: string;
      title: string;
    }[];
  }
}
```

---

### 2. 智能推荐 (Recommendation Agent)

**功能描述**：基于需求推荐最佳产品

**接口位置**：`src/components/AIFunctionPanel.tsx` (activeTab === 'recommend')

**集成方式**：
```typescript
// 添加推荐场景点击处理
const handleScenarioClick = async (scenario: string) => {
  // TODO: 调用推荐API
  // const response = await fetch('/api/ai/recommend', {
  //   method: 'POST',
  //   body: JSON.stringify({ scenario, userNeeds: '...' })
  // });
  
  // 跳转到推荐结果页面或显示推荐对话框
};

// 在推荐按钮添加onClick处理
<Button onClick={() => handleScenarioClick(selectedScenario)}>
  开始智能推荐
</Button>
```

**API 接口设计**：
```typescript
// POST /api/ai/recommend
{
  scenario: string;        // 应用场景
  requirements: string[];  // 需求列表
  constraints?: {          // 约束条件
    budget?: string;
    industry?: string;
    scale?: string;
  }
}

// Response
{
  success: boolean;
  data: {
    recommendations: {
      productId: string;
      matchScore: number;    // 匹配度 0-100
      reason: string;        // 推荐理由
      matchedFeatures: string[]; // 匹配的功能
    }[];
    analysis: string;        // AI分析说明
  }
}
```

---

### 3. 对比分析 (Analysis Agent)

**功能描述**：多维度对比产品功能

**接口位置**：`src/components/AIFunctionPanel.tsx` (activeTab === 'analysis')

**集成方式**：
```typescript
// 生成对比报告
const generateComparisonReport = async () => {
  // TODO: 调用对比分析API
  // const response = await fetch('/api/ai/compare', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     productIds: ['knowledge-base', 'vision-inspection'],
  //     dimensions: ['功能完整度', '技术成熟度', '应用场景适配']
  //   })
  // });
};
```

**API 接口设计**：
```typescript
// POST /api/ai/compare
{
  productIds: string[];        // 要对比的产品ID列表
  dimensions: string[];        // 对比维度
  format?: 'json' | 'markdown' | 'pdf';  // 输出格式
}

// Response
{
  success: boolean;
  data: {
    comparison: {
      dimension: string;
      products: {
        productId: string;
        score: number;
        details: string;
      }[];
    }[];
    conclusion: string;        // 总结性分析
    recommendation: string;    // 选择建议
  }
}
```

---

### 4. OpenClaw 集成接口

**功能描述**：自定义AI工具和Agent工作流

**预留位置**：`src/components/Sidebar.tsx` (OpenClaw 集成区块)

**集成方式**：

#### 4.1 配置文件
创建 `config/openclaw.config.ts`：

```typescript
export const openClawConfig = {
  apiUrl: process.env.NEXT_PUBLIC_OPENCLAW_API_URL,
  apiKey: process.env.OPENCLAW_API_KEY,
  workflows: [
    {
      id: 'product-analysis',
      name: '产品功能分析',
      trigger: 'onProductSelect',
      config: {
        // OpenClaw工作流配置
      }
    },
    {
      id: 'feature-recommendation',
      name: '功能智能推荐',
      trigger: 'manual',
      config: {
        // OpenClaw工作流配置
      }
    }
  ]
};
```

#### 4.2 工作流触发器

```typescript
// 在产品切换时触发工作流
const handleProductChange = async (productId: string) => {
  setActiveProduct(productId);
  
  // TODO: 触发OpenClaw工作流
  // await fetch('/api/openclaw/trigger', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     workflowId: 'product-analysis',
  //     payload: { productId }
  //   })
  // });
};
```

#### 4.3 API 接口设计

```typescript
// POST /api/openclaw/trigger
{
  workflowId: string;      // 工作流ID
  payload: any;            // 工作流输入数据
  async?: boolean;         // 是否异步执行
}

// Response
{
  success: boolean;
  data: {
    executionId: string;   // 执行ID
    status: 'running' | 'completed' | 'failed';
    result?: any;          // 执行结果（同步模式）
  }
}

// GET /api/openclaw/status?executionId=xxx
{
  executionId: string;
  status: 'running' | 'completed' | 'failed';
  progress?: number;       // 进度百分比
  result?: any;            // 执行结果
}
```

---

## 数据结构定义

### 产品上下文数据
```typescript
interface ProductContext {
  id: string;
  name: string;
  icon: string;
  shortDescription: string;
  positioning: string;
  industries: string[];
  deployment: string[];
  coreValues: string[];
  modules: {
    id: string;
    name: string;
    description?: string;
    features: {
      title: string;
      description: string;
    }[];
  }[];
}
```

### AI 消息格式
```typescript
interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    productId?: string;
    moduleId?: string;
    confidence?: number;  // AI置信度
  };
}
```

---

## 环境变量配置

在 `.env.local` 文件中添加：

```bash
# AI API配置
NEXT_PUBLIC_AI_API_URL=https://your-ai-api.com
AI_API_KEY=your_api_key_here

# OpenClaw配置
NEXT_PUBLIC_OPENCLAW_API_URL=https://your-openclaw-instance.com
OPENCLAW_API_KEY=your_openclaw_key_here

# 其他配置
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_AI_RECOMMEND=true
NEXT_PUBLIC_ENABLE_AI_ANALYSIS=false
```

---

## 开发步骤

### 第一阶段：基础集成
1. 创建 `/api/ai/chat` 接口
2. 替换 `AIFunctionPanel` 中的模拟响应
3. 添加错误处理和加载状态

### 第二阶段：功能增强
1. 实现推荐API `/api/ai/recommend`
2. 实现对比API `/api/ai/compare`
3. 添加结果缓存机制

### 第三阶段：OpenClaw集成
1. 配置OpenClaw工作流
2. 实现工作流触发器
3. 添加执行状态监控

---

## 注意事项

1. **API密钥安全**：所有API密钥必须存储在服务端，不要暴露给客户端
2. **请求频率限制**：实现API调用频率限制，避免过度消耗资源
3. **错误处理**：所有AI调用必须有完善的错误处理和降级方案
4. **数据验证**：对用户输入进行验证，防止注入攻击
5. **性能优化**：考虑使用流式响应提升用户体验

---

## 示例代码仓库

完整的集成示例代码将在后续提供...

## 技术支持

如有问题，请联系：
- 前端负责人：[联系方式]
- AI开发负责人：[联系方式]
