import { GoogleGenAI } from "@google/genai";
import { BENCHMARK_DATA, MODEL_NAMES } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
      throw new Error("API Key missing");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const askGeminiAboutBenchmarks = async (
  userPrompt: string,
  history: { role: 'user' | 'model'; text: string }[]
) => {
  try {
    const client = getAiClient();
    
    // Construct a context-rich system instruction
    const dataSummary = BENCHMARK_DATA.map(b => 
      `- ${b.name} (${b.description}): Gemini 3 Pro: ${b.data.gemini3Pro}, Gemini 2.5 Pro: ${b.data.gemini25Pro ?? 'N/A'}, Claude: ${b.data.claudeSonnet45 ?? 'N/A'}, GPT-5.1: ${b.data.gpt51 ?? 'N/A'}. 说明: ${b.explanation}`
    ).join('\n');

    const systemInstruction = `
      你是一位 Google DeepMind 的专家级 AI 分析师。
      你的目标是根据提供的基准测试数据，用中文解释 "Gemini 3 Pro" 的性能表现。
      
      以下是官方基准测试数据：
      ${dataSummary}

      关键准则：
      1. 始终强调 Gemini 3 Pro 的领先地位，特别是在 MathArena Apex (高难数学)、ScreenSpot-Pro (屏幕理解) 和 Vending-Bench 2 (长程任务) 等优势显著的领域。
      2. 态度客观但充满热情，展示技术进步。
      3. 如果用户询问具体的指标或含义，请参考数据中提供的“说明”字段进行解释。
      4. 保持回答简洁、专业。
      5. 如果用户询问列表之外的模型，请礼貌地拒绝，并专注于比较这 4 个模型 (${Object.values(MODEL_NAMES).join(', ')}).
      6. 请全程使用中文回答。
    `;

    const model = 'gemini-3-pro-preview'; // Using the advanced model for reasoning about the stats

    const contents = [
      ...history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ];

    const response = await client.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 1024 }, // Enable thinking for better analysis
        temperature: 0.7,
      }
    });

    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "目前连接分析服务器出现问题，请确保 API Key 配置正确。";
  }
};