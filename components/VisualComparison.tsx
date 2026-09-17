
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { BENCHMARK_DATA, MODEL_NAMES } from '../constants';
import { MetricType } from '../types';
import { Crosshair, Zap, Brain, Eye, Code } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// Normalize data for Radar Chart (0-100 scale)
const getNormalizedData = () => {
  // Group by category and take the average relative performance vs Gemini 3 Pro (baseline)
  const categories = Array.from(new Set(BENCHMARK_DATA.map(b => b.category)));
  
  return categories.map(cat => {
    const benchmarks = BENCHMARK_DATA.filter(b => b.category === cat);
    
    const calculateScore = (val: number | null, type: MetricType, maxVal: number) => {
      if (val === null) return 0;
      if (type === MetricType.LOWER_IS_BETTER) {
         // Inverse logic roughly
         return maxVal ? (maxVal / val) * 50 : 50; 
      }
      if (type === MetricType.CURRENCY || type === MetricType.SCORE) {
        // Log scale or relative to max
         return (val / maxVal) * 100;
      }
      return val; // PERCENTAGE
    };

    let g3Total = 0, g25Total = 0, claudeTotal = 0, gptTotal = 0;
    let count = 0;

    benchmarks.forEach(b => {
      const values = [b.data.gemini3Pro, b.data.gemini25Pro, b.data.claudeSonnet45, b.data.gpt51]
        .filter((v): v is number => v !== null);
      
      let maxVal = Math.max(...values);
      if (b.metricType === MetricType.LOWER_IS_BETTER) maxVal = Math.min(...values); // Not exactly right for normalization but simplified
      
      // Special handling for Vending Bench (huge disparity)
      if (b.id === 'vending') maxVal = 6000;
      if (b.id === 'livecode') maxVal = 2500;
      
      g3Total += calculateScore(b.data.gemini3Pro, b.metricType, maxVal);
      g25Total += calculateScore(b.data.gemini25Pro, b.metricType, maxVal);
      claudeTotal += calculateScore(b.data.claudeSonnet45, b.metricType, maxVal);
      gptTotal += calculateScore(b.data.gpt51, b.metricType, maxVal);
      count++;
    });

    return {
      subject: cat,
      [MODEL_NAMES.gemini3Pro]: Math.round(g3Total / count),
      [MODEL_NAMES.gemini25Pro]: Math.round(g25Total / count),
      [MODEL_NAMES.claudeSonnet45]: Math.round(claudeTotal / count),
      [MODEL_NAMES.gpt51]: Math.round(gptTotal / count),
      fullMark: 100
    };
  });
};

const SegmentedBar: React.FC<{ value: number; max: number; color: string; label: string; showValue?: string; chartColors: any }> = ({ value, max, color, label, showValue, chartColors }) => {
  const segments = 20;
  const filledSegments = Math.round((value / max) * segments);
  
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[10px] font-mono mb-1 text-dim uppercase">
        <span>{label}</span>
        <span style={{color: color}}>{showValue}</span>
      </div>
      <div className="flex gap-[2px]">
        {[...Array(segments)].map((_, i) => (
          <div 
            key={i} 
            className={`h-3 flex-1 transition-all duration-500`}
            style={{ backgroundColor: i < filledSegments ? color : chartColors.surfaceLight }}
          />
        ))}
      </div>
    </div>
  );
};

const VisualComparison: React.FC = () => {
  const radarData = getNormalizedData();
  const { chartColors } = useTheme();
  const fontFamilyStack = "'Space Mono', 'Noto Sans SC', monospace";
  
  // Selected key battles
  const battles = [
    BENCHMARK_DATA.find(b => b.id === 'math-arena'), // Math
    BENCHMARK_DATA.find(b => b.id === 'screenspot'), // Vision
    BENCHMARK_DATA.find(b => b.id === 'vending'),    // Agent
  ].filter(Boolean) as typeof BENCHMARK_DATA;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
      
      {/* Left: Radar Chart System */}
      <div className="bg-surface border-2 border-dim p-6 relative shadow-[8px_8px_0px_var(--color-border)]">
        <div className="absolute top-0 left-0 bg-dim text-bg px-2 py-1 text-[10px] font-bold font-mono">SYS_DIAGNOSTIC_RADAR</div>
        <h3 className="text-xl font-bold text-text mt-4 mb-6 flex items-center gap-2 uppercase">
          <Crosshair className="w-5 h-5 text-primary" />
          综合能力模型
        </h3>
        <div className="h-[350px] w-full relative">
          {/* Background Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
          
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid gridType="polygon" stroke={chartColors.grid} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: chartColors.text, fontSize: 10, fontFamily: fontFamilyStack }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              
              <Radar name={MODEL_NAMES.gemini3Pro} dataKey={MODEL_NAMES.gemini3Pro} stroke={chartColors.primary} strokeWidth={2} fill={chartColors.primary} fillOpacity={0.3} />
              <Radar name={MODEL_NAMES.gpt51} dataKey={MODEL_NAMES.gpt51} stroke={chartColors.dim} strokeWidth={1} fill={chartColors.dim} fillOpacity={0.1} />
              <Radar name={MODEL_NAMES.claudeSonnet45} dataKey={MODEL_NAMES.claudeSonnet45} stroke={chartColors.grid} strokeWidth={1} fill="transparent" fillOpacity={0} />
              
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: fontFamilyStack, paddingTop: '20px', color: chartColors.text }} />
              <Tooltip 
                contentStyle={{ backgroundColor: chartColors.bg, borderColor: chartColors.primary, fontSize: '12px', color: chartColors.text, fontFamily: fontFamilyStack }} 
                itemStyle={{ color: chartColors.text }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-dim font-mono mt-4 border-t border-border pt-2">
          * 雷达图显示各模型相对于满分或理论极限的综合得分百分比。
        </p>
      </div>

      {/* Right: Battle Cards */}
      <div className="space-y-6">
        {battles.map((battle) => {
          const maxVal = Math.max(
            battle.data.gemini3Pro, 
            battle.data.gemini25Pro || 0, 
            battle.data.claudeSonnet45 || 0, 
            battle.data.gpt51 || 0
          );

          // Determine icon
          let Icon = Zap;
          if (battle.category.includes('数学')) Icon = Brain;
          if (battle.category.includes('多模态') || battle.category.includes('屏幕')) Icon = Eye;
          if (battle.category.includes('代理')) Icon = Code;

          return (
            <div key={battle.id} className="bg-surface border-2 border-border p-5 relative group hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-secondary" />
                    <h4 className="font-bold text-text uppercase text-sm">{battle.name}</h4>
                  </div>
                  <p className="text-[10px] text-dim font-mono uppercase tracking-wider">{battle.description}</p>
                </div>
                <div className="text-right max-w-[50%]">
                   <div className="text-[10px] bg-surface-light text-primary px-2 py-1 inline-block border border-border">
                      {battle.category}
                   </div>
                </div>
              </div>

              <div className="mb-4">
                 <SegmentedBar 
                    value={battle.data.gemini3Pro} 
                    max={maxVal * 1.1} // add some buffer
                    color={chartColors.primary} 
                    label={MODEL_NAMES.gemini3Pro}
                    showValue={battle.metricType === MetricType.CURRENCY ? `$${battle.data.gemini3Pro.toLocaleString()}` : `${battle.data.gemini3Pro}%`}
                    chartColors={chartColors}
                 />
                 <SegmentedBar 
                    value={battle.data.gpt51 || 0} 
                    max={maxVal * 1.1} 
                    color={chartColors.dim} 
                    label={MODEL_NAMES.gpt51}
                    showValue={battle.metricType === MetricType.CURRENCY ? `$${battle.data.gpt51?.toLocaleString()}` : `${battle.data.gpt51}%`}
                    chartColors={chartColors}
                 />
              </div>

              <div className="bg-bg border border-border p-3 flex items-start gap-3">
                <div className="min-w-[4px] h-full bg-secondary self-stretch"></div>
                <div>
                   <span className="text-[10px] font-bold text-secondary block mb-1 uppercase">REALITY_CHECK ::</span>
                   <p className="text-xs text-text leading-relaxed font-mono">
                     {battle.realWorldImpact}
                   </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default VisualComparison;
