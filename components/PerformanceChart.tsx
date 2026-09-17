
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BENCHMARK_DATA, MODEL_NAMES } from '../constants';
import { MetricType } from '../types';
import { Activity } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const PerformanceChart: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('全部');
  const { chartColors, readerMode } = useTheme();

  const categories = ['全部', ...Array.from(new Set(BENCHMARK_DATA.map(b => b.category)))];

  const chartData = BENCHMARK_DATA
    .filter(b => (filterCategory === '全部' || b.category === filterCategory) && b.metricType === MetricType.PERCENTAGE)
    .map(b => ({
      name: b.name,
      [MODEL_NAMES.gemini3Pro]: b.data.gemini3Pro,
      [MODEL_NAMES.gemini25Pro]: b.data.gemini25Pro || 0,
      [MODEL_NAMES.claudeSonnet45]: b.data.claudeSonnet45 || 0,
      [MODEL_NAMES.gpt51]: b.data.gpt51 || 0,
      desc: b.description
    }));

  const fontFamilyStack = "'Space Mono', 'Noto Sans SC', monospace";

  return (
    <div className="relative bg-surface border-2 border-dim p-6 shadow-[8px_8px_0px_var(--color-border)]">
      {/* Decorative corners */}
      {!readerMode && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 bg-primary"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-primary"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary"></div>
        </>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b-2 border-border pb-4">
        <div>
            <h3 className="text-xl font-bold text-text flex items-center gap-3 uppercase font-mono">
              <Activity className="w-5 h-5 text-secondary" />
              VISUAL_DATA_PLOT_v1.0
            </h3>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="block w-full pl-3 pr-8 py-2 text-sm font-mono bg-bg border-2 border-dim text-primary focus:outline-none focus:border-primary uppercase"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[450px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray={readerMode ? "0" : "3 3"} vertical={false} stroke={chartColors.grid} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100} 
                interval={0} 
                tick={{fontSize: 10, fill: chartColors.dim, fontFamily: fontFamilyStack, textTransform: 'uppercase'}}
                stroke={chartColors.dim}
              />
              <YAxis 
                unit="%" 
                tick={{fill: chartColors.dim, fontSize: 10, fontFamily: fontFamilyStack}} 
                stroke={chartColors.dim} 
              />
              <Tooltip 
                cursor={{fill: readerMode ? 'transparent' : 'rgba(255, 176, 0, 0.1)'}}
                contentStyle={{ 
                  backgroundColor: chartColors.surface,
                  borderColor: chartColors.secondary, 
                  borderWidth: '2px',
                  boxShadow: readerMode ? 'none' : '4px 4px 0px var(--color-border)',
                  padding: '12px',
                  borderRadius: readerMode ? '4px' : '0px',
                  fontFamily: fontFamilyStack
                }}
                itemStyle={{ color: chartColors.text, padding: '2px 0', fontSize: '12px' }}
                labelStyle={{ color: chartColors.primary, fontWeight: 'bold', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', borderBottom: `1px dashed ${chartColors.grid}` }}
                formatter={(value: number) => [`${value}%`]}
              />
              <Legend 
                verticalAlign="top" 
                wrapperStyle={{paddingBottom: '20px', fontFamily: fontFamilyStack, fontSize: '12px', color: chartColors.text}}
                iconType="square"
              />
              
              <Bar dataKey={MODEL_NAMES.gemini3Pro} name="G3_PRO" fill={chartColors.primary} stroke={readerMode ? 'transparent' : '#000'} strokeWidth={1} />
              <Bar dataKey={MODEL_NAMES.gpt51} name="GPT-5.1" fill={chartColors.dim} stroke={readerMode ? 'transparent' : '#000'} strokeWidth={1} />
              <Bar dataKey={MODEL_NAMES.claudeSonnet45} name="CLAUDE" fill={chartColors.grid} stroke={readerMode ? 'transparent' : '#000'} strokeWidth={1} />
              <Bar dataKey={MODEL_NAMES.gemini25Pro} name="G2.5_PRO" fill={chartColors.bg} stroke={chartColors.dim} strokeWidth={1} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-dim bg-surface-light border-2 border-dashed border-border">
            <Activity className="w-12 h-12 mb-4" />
            <p className="font-mono uppercase">NO DATA SIGNAL</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
