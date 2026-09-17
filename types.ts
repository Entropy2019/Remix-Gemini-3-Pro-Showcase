export enum MetricType {
  PERCENTAGE = 'PERCENTAGE',
  SCORE = 'SCORE',
  CURRENCY = 'CURRENCY',
  LOWER_IS_BETTER = 'LOWER_IS_BETTER' // e.g. Edit Distance
}

export interface ModelData {
  gemini3Pro: number;
  gemini25Pro: number | null; // null if not supported/available
  claudeSonnet45: number | null;
  gpt51: number | null;
}

export interface BenchmarkDetails {
  challenge: string; // The nature of the specific test case
  input: string; // The prompt or question given
  geminiOutput: string; // Summary of Gemini's correct/better response
  competitorOutput: string; // Summary of competitor's failure/worse response
  competitorName: string; // Which model failed
  analysis: string; // Why Gemini won
}

export interface Benchmark {
  id: string;
  name: string;
  category: string;
  description: string;
  explanation: string;
  realWorldImpact: string; 
  metricType: MetricType;
  data: ModelData;
  tags?: string[];
  details?: BenchmarkDetails; // New field for the modal content
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}