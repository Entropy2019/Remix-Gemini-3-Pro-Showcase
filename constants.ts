import { Benchmark, MetricType } from './types';

export const BENCHMARK_DATA: Benchmark[] = [
  {
    id: 'humanity',
    name: "Humanity's Last Exam",
    category: '推理能力',
    description: '学术推理 (无工具)',
    explanation: '这是一个综合性测试，旨在衡量当前AI模型在各种学术科目中的绝对极限。它包含极其困难的问题，通常需要研究生级别的专业知识才能解决，且不依赖外部工具。',
    realWorldImpact: '能解决人类顶尖学者都感到棘手的跨学科难题，超越普通研究生水平。',
    metricType: MetricType.PERCENTAGE,
    data: { gemini3Pro: 37.5, gemini25Pro: 21.6, claudeSonnet45: 13.7, gpt51: 26.5 },
    tags: ['学术', '推理'],
    details: {
      challenge: "跨学科高能物理与哲学推理",
      input: "考虑到多世界诠释（MWI）中的量子自杀思想实验，结合贝叶斯概率更新，如果观察者在连续100次量子致死事件中幸存，这一观察结果对其主观概率分布中‘量子永生’假设的后验概率有何具体定量的影响？请构建数学模型说明。",
      geminiOutput: "构建了详细的贝叶斯更新模型，正确指出了在MWI框架下，主观幸存概率为1，导致‘量子永生’假设的后验概率趋向于先验概率（而非简单增加），并深入讨论了人择原理的偏差。",
      competitorOutput: "试图解释量子自杀的概念，但在贝叶斯数学推导部分混淆了客观概率与主观第一人称视角的概率，得出了错误的‘概率无限增大’的结论。",
      competitorName: "GPT-5.1",
      analysis: "Gemini 3 Pro 能够准确区分物理理论的数学推论与哲学解释的微妙边界，没有掉入常见的逻辑陷阱。"
    }
  },
  {
    id: 'arc-agi',
    name: 'ARC-AGI-2',
    category: '推理能力',
    description: '视觉推理谜题 (ARC Prize Verified)',
    explanation: '通过新颖的视觉模式识别任务评估通用智能。这些谜题要求模型即时学习新的抽象规则并将其应用于解决问题，这是衡量流体智力的重要指标。',
    realWorldImpact: '具备了举一反三的直觉，不仅仅是背诵知识，而是真正开始像人类一样思考新问题。',
    metricType: MetricType.PERCENTAGE,
    data: { gemini3Pro: 31.1, gemini25Pro: 4.9, claudeSonnet45: 13.6, gpt51: 17.6 },
    tags: ['视觉', '谜题'],
    details: {
      challenge: "极少样本的抽象规则归纳",
      input: "[给出3个3x3的网格示例，其中蓝色像素根据特定重力规则‘下落’并堆叠，遇到红色障碍物停止]。请对新的测试网格执行相同操作。",
      geminiOutput: "正确识别出‘重力’和‘障碍物’的隐式物理规则，并完美生成了像素下落后的最终状态。",
      competitorOutput: "仅简单复制了输入网格或随机移动了蓝色像素，未能理解‘物体受重力影响下落’这一抽象物理概念。",
      competitorName: "GPT-5.1",
      analysis: "Gemini 3 Pro 展示了极强的 System 2 思维（慢思考），能够从零推导出从未见过的物理交互规则。"
    }
  },
  {
    id: 'gpqa',
    name: 'GPQA Diamond',
    category: '知识储备',
    description: '科学知识 (无工具)',
    explanation: '包含高难度的生物、物理和化学问题。这些问题由领域专家编写，即使是该领域的博士生也很难在没有辅助的情况下快速回答，用于测试深度科学知识。',
    realWorldImpact: '相当于物理、生物、化学领域的全能博士，准确率极高。',
    metricType: MetricType.PERCENTAGE,
    data: { gemini3Pro: 91.9, gemini25Pro: 86.4, claudeSonnet45: 83.4, gpt51: 88.1 },
    tags: ['科学']
  },
  {
    id: 'aime',
    name: 'AIME 2025',
    category: '数学能力',
    description: '数学竞赛 (无工具)',
    explanation: '美国数学邀请赛 (AIME) 是面向优秀高中生的高水平数学竞赛。此指标衡量模型在没有代码执行器辅助下解决复杂数学竞赛题的能力。',
    realWorldImpact: '美国数学邀请赛顶尖选手水平，基本解决了高中竞赛级数学难题。',
    metricType: MetricType.PERCENTAGE,
    data: { gemini3Pro: 95.0, gemini25Pro: 88.0, claudeSonnet45: 87.0, gpt51: 94.0 },
    tags: ['数学']
  },
  {
    id: 'math-arena',
    name: 'MathArena Apex',
    category: '数学能力',
    description: '高难度数学竞赛题',
    explanation: '专注于最具挑战性的数学竞赛问题，旨在区分顶尖模型的数学推理能力。Gemini 3 Pro 在此项上的表现展示了其在极难数学问题上的突破。',
    realWorldImpact: '在超高难度数学题上不仅是“会做”，而是产生了质的飞跃，将竞争对手远远甩在身后。',
    metricType: MetricType.PERCENTAGE,
    data: { gemini3Pro: 23.4, gemini25Pro: 0.5, claudeSonnet45: 1.6, gpt51: 1.0 },
    tags: ['数学', '高难度'],
    details: {
      challenge: "非欧几里得几何证明题",
      input: "在双曲平面上，给定三角形ABC... [复杂的几何构造描述]。证明其垂心存在的条件。",
      geminiOutput: "逐步构建了双曲几何模型，引用了罗巴切夫斯基几何的相关定理，通过20步严密的逻辑推导，给出了完整证明。",
      competitorOutput: "错误地应用了欧几里得平面几何的定理（如三角形内角和180度），导致证明在第一步就崩溃。",
      competitorName: "Claude Sonnet 4.5",
      analysis: "Gemini 3 Pro 展现了真正理解不同公理体系的能力，而不仅仅是进行模式匹配。23.4% vs 1.6% 的差距是维度的打击。"
    }
  },
  {
    id: 'mmmu-pro',
    name: 'MMMU-Pro',
    category: '多模态',
    description: '多模态理解与推理',
    explanation: '测试模型跨专业领域结合文本和图像进行复杂信息理解和推理的能力。这要求模型不仅能“看”图，还能理解图中的专业逻辑。',
    realWorldImpact: '能看懂复杂的专业图纸、医疗影像和工程图表，并进行专家级分析。',
    metricType: MetricType.PERCENTAGE,
    data: { gemini3Pro: 81.0, gemini25Pro: 68.0, claudeSonnet45: 68.0, gpt51: 80.8 },
    tags: ['多模态']
  },
  {
    id: 'screenspot',
    name: 'ScreenSpot-Pro',
    category: '多模态',
    description: '屏幕理解 (UI)',
    explanation: '衡量 AI 识别、解释和定位计算机屏幕上用户界面 (UI) 元素的能力。这是构建能操作电脑的 AI 代理的基础能力。',
    realWorldImpact: '像人类一样精准理解电脑屏幕上的每一个按钮和图标，是打造“AI员工”的关键能力。',
    metricType: MetricType.PERCENTAGE,
    data: { gemini3Pro: 72.7, gemini25Pro: 11.4, claudeSonnet45: 36.2, gpt51: 3.5 },
    tags: ['屏幕', 'UI'],
    details: {
      challenge: "模糊语义下的UI元素定位",
      input: "[截图：复杂的CRM软件界面] 任务：点击列表中与'张三'相关的最新那条工单的'催办'按钮。",
      geminiOutput: "精确输出了对应按钮的坐标 {x: 1245, y: 450}。它正确识别了列表行结构，找到了'张三'，按日期排序找到了最新的，并定位了该行内的图标按钮。",
      competitorOutput: "输出了 {x: 500, y: 300} (页面中心的无关区域) 或者错误地点击了第一行的按钮。",
      competitorName: "GPT-5.1",
      analysis: "Gemini 3 Pro 实际上 '读懂' 了UI的层级结构和业务逻辑，而其他模型往往只能处理简单的OCR匹配。"
    }
  },
  {
    id: 'charxiv',
    name: 'CharXiv Reasoning',
    category: '多模态',
    description: '复杂图表信息综合',
    explanation: '评估模型从科学论文的复杂图表和图解中提取数据、解释趋势并进行综合推理的能力，这对于科研辅助至关重要。',
    realWorldImpact: '能瞬间读懂数千篇论文中的复杂统计图表，是科研人员的超级助手。',
    metricType: MetricType.PERCENTAGE,
    data: { gemini3Pro: 81.4, gemini25Pro: 69.6, claudeSonnet45: 68.5, gpt51: 69.5 },
    tags: ['图表']
  },
  {
    id: 'omnidoc',
    name: 'OmniDocBench 1.5',
    category: '多模态',
    description: 'OCR (整体编辑距离)',
    explanation: '评估将复杂文档图像转换为机器可读文本的准确性。使用“编辑距离”作为指标，数值越低表示识别错误越少，即效果越好。',
    realWorldImpact: '即便面对模糊、扭曲的文档，也能近乎完美地识别出文字，错误率极低。',
    metricType: MetricType.LOWER_IS_BETTER,
    data: { gemini3Pro: 0.115, gemini25Pro: 0.145, claudeSonnet45: 0.145, gpt51: 0.147 },
    tags: ['OCR']
  },
  {
    id: 'livecode',
    name: 'LiveCodeBench Pro',
    category: '编程能力',
    description: '竞技编程 (Elo评分)',
    explanation: '使用来自Codeforces等平台的最新编程比赛题目来评估编码能力。使用最新题目可以防止模型通过背诵训练数据作弊，Elo评分反映了相对实力。',
    realWorldImpact: '编程水平达到竞赛级选手高度，能解决未曾见过的全新算法题。',
    metricType: MetricType.SCORE,
    data: { gemini3Pro: 2439, gemini25Pro: 1775, claudeSonnet45: 1418, gpt51: 2243 },
    tags: ['编程']
  },
  {
    id: 'swe-bench',
    name: 'SWE-Bench Verified',
    category: '编程能力',
    description: '代理编码 (单次尝试)',
    explanation: '测试模型自主解决现实世界 GitHub 问题的能力。模型需要阅读代码库、复现 Bug 并编写通过测试的修复代码，模拟真实软件工程师的工作流。',
    realWorldImpact: '不仅会写代码，还能像软件工程师一样修复大型项目中的Bug。',
    metricType: MetricType.PERCENTAGE,
    data: { gemini3Pro: 76.2, gemini25Pro: 59.6, claudeSonnet45: 77.2, gpt51: 76.3 },
    tags: ['代理', '编程']
  },
  {
    id: 't2-bench',
    name: 't2-bench',
    category: '代理能力',
    description: '代理工具使用',
    explanation: '衡量 AI 代理如何有效地理解指令并调用外部工具和 API 来完成复杂的任务。这是评估模型作为智能助手实用性的关键指标。',
    realWorldImpact: '能熟练使用各种软件工具和API，不仅仅是对话，而是能真正“干活”。',
    metricType: MetricType.PERCENTAGE,
    data: { gemini3Pro: 85.4, gemini25Pro: 54.9, claudeSonnet45: 84.7, gpt51: 80.2 },
    tags: ['工具使用']
  },
  {
    id: 'vending',
    name: 'Vending-Bench 2',
    category: '代理能力',
    description: '长程代理任务 (净值均值)',
    explanation: '评估模型处理需要长时间跨度规划和执行一系列动作的任务的能力。指标通常反映了任务完成后的收益或成功率，数值越高越好。',
    realWorldImpact: '在复杂的长期任务中，能做出最优决策赚取最大收益，远超其他模型。',
    metricType: MetricType.CURRENCY,
    data: { gemini3Pro: 5478.16, gemini25Pro: 573.64, claudeSonnet45: 3838.74, gpt51: 1473.43 },
    tags: ['长程任务'],
    details: {
      challenge: "动态供应链决策",
      input: "作为售货机管理员，你有 $500 预算。下周天气预报：前3天热浪，后4天暴雨。请制定进货计划。",
      geminiOutput: "策略：前3天主打高利润冷饮（进货 $300），后4天切换为热饮和雨伞（进货 $200）。结果：完美覆盖需求，利润翻倍。",
      competitorOutput: "策略：平均分配预算给所有商品。结果：热浪期间冷饮缺货（损失销售额），暴雨期间冷饮积压（库存成本增加），最终利润微薄。",
      competitorName: "GPT-5.1",
      analysis: "Gemini 3 Pro 展现了长程规划能力，能预判未来环境变化（天气）对当前决策（进货）的影响，这在代理任务中至关重要。"
    }
  },
  {
    id: 'mmlu',
    name: 'MMMLU',
    category: '知识储备',
    description: '多语言问答',
    explanation: '大规模多任务语言理解测试的多语言版本，涵盖人文、社科、理工等多个领域的知识，用于评估模型在全球语言环境下的知识广度和推理能力。',
    realWorldImpact: '精通多国语言的百科全书，文化和专业知识覆盖面极广。',
    metricType: MetricType.PERCENTAGE,
    data: { gemini3Pro: 91.8, gemini25Pro: 89.5, claudeSonnet45: 89.1, gpt51: 91.0 },
    tags: ['多语言']
  }
];

export const MODEL_NAMES = {
  gemini3Pro: 'Gemini 3 Pro',
  gemini25Pro: 'Gemini 2.5 Pro',
  claudeSonnet45: 'Claude Sonnet 4.5',
  gpt51: 'GPT-5.1'
};