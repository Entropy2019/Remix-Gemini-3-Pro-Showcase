import React, { useState } from 'react';
import { BENCHMARK_DATA, MODEL_NAMES } from '../constants';
import { MetricType, ModelData, Benchmark } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Search, Info } from 'lucide-react';

interface BenchmarkTableProps {
  onSelectBenchmark?: (benchmark: Benchmark) => void;
}

const formatValue = (value: number | null, type: MetricType) => {
  if (value === null) return 'ERR_NULL';
  if (type === MetricType.PERCENTAGE) return `${value}%`;
  if (type === MetricType.CURRENCY) return `$${value.toLocaleString()}`;
  return value.toLocaleString();
};

const BenchmarkTable: React.FC<BenchmarkTableProps> = ({ onSelectBenchmark }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const { readerMode } = useTheme();

  const isBest = (benchmarkId: string, modelKey: keyof ModelData) => {
    const benchmark = BENCHMARK_DATA.find(b => b.id === benchmarkId);
    if (!benchmark) return false;

    const values = Object.entries(benchmark.data)
      .map(([_, val]) => val)
      .filter((val): val is number => val !== null);

    if (values.length === 0) return false;

    const currentVal = benchmark.data[modelKey];
    if (currentVal === null) return false;

    if (benchmark.metricType === MetricType.LOWER_IS_BETTER) {
      return currentVal === Math.min(...values);
    }
    return currentVal === Math.max(...values);
  };

  return (
    <div className="relative">
      {/* Decorative Header Bar */}
      <div className="flex items-center justify-between bg-surface-light border-2 border-dim border-b-0 p-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <h3 className="text-text font-bold uppercase tracking-wider text-sm">
            /LOGS/PERFORMANCE_METRICS.DAT
          </h3>
        </div>
        <div className="text-accent font-mono text-xs animate-pulse">
          STATUS: RECORDING
        </div>
      </div>

      <div className="overflow-x-auto border-2 border-dim bg-surface">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg border-b-2 border-dim">
              <th className="px-6 py-4 text-xs font-bold text-secondary uppercase font-mono tracking-wider sticky left-0 bg-bg border-r-2 border-dim z-20">
                ID :: BENCHMARK
              </th>
              <th className="px-6 py-4 text-xs font-bold text-dim uppercase font-mono tracking-wider hidden md:table-cell">
                DESC
              </th>
              <th className="px-6 py-4 text-xs font-bold text-primary uppercase font-mono tracking-wider border-l border-border bg-surface-light">
                 {MODEL_NAMES.gemini3Pro}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-dim uppercase font-mono tracking-wider border-l border-border">
                {MODEL_NAMES.gemini25Pro}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-dim uppercase font-mono tracking-wider border-l border-border">
                {MODEL_NAMES.claudeSonnet45}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-dim uppercase font-mono tracking-wider border-l border-border">
                {MODEL_NAMES.gpt51}
              </th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {BENCHMARK_DATA.map((benchmark, index) => (
              <tr key={benchmark.id} className="border-b border-border hover:bg-surface-light transition-colors group">
                <td className={`px-6 py-4 text-text sticky left-0 bg-surface group-hover:bg-surface-light border-r-2 border-dim ${activeTooltip === benchmark.id ? 'z-30' : 'z-10'}`}>
                  <div className="flex items-center justify-between relative gap-2">
                    <span className="uppercase font-bold tracking-tight">{benchmark.name}</span>
                    
                    <div className="flex items-center">
                      {/* Detail Modal Trigger - Only if details exist */}
                      {benchmark.details && (
                        <button 
                          onClick={() => onSelectBenchmark && onSelectBenchmark(benchmark)}
                          className="text-secondary hover:text-primary p-1 mr-1 transition-transform hover:scale-110"
                          title="View Analysis Report"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Tooltip Trigger */}
                      <button 
                        className="text-dim hover:text-primary focus:outline-none p-1"
                        onClick={() => setActiveTooltip(activeTooltip === benchmark.id ? null : benchmark.id)}
                        title="Quick Info"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Retro Tooltip */}
                    {activeTooltip === benchmark.id && (
                      <div className="absolute left-full top-0 ml-2 w-64 bg-surface text-text border-2 border-border p-4 shadow-[4px_4px_0px_var(--color-border)] z-50">
                         <div className="font-bold mb-2 border-b border-border pb-1 text-secondary uppercase text-xs flex items-center">
                            {'>'} {benchmark.category}
                         </div>
                         <div className="text-xs leading-tight mb-2">{benchmark.explanation}</div>
                         {benchmark.details && (
                           <div className="text-[10px] text-accent italic mt-2 pt-2 border-t border-border/50">
                             * Click magnifying glass for detailed analysis
                           </div>
                         )}
                      </div>
                    )}
                  </div>
                  <div className="md:hidden text-[10px] text-dim mt-1 truncate max-w-[150px] uppercase">
                    {benchmark.description}
                  </div>
                </td>
                <td className="px-6 py-4 text-dim hidden md:table-cell uppercase text-xs tracking-tighter">
                  {benchmark.description}
                </td>
                
                {/* Gemini 3 Pro */}
                <td className="px-6 py-4 border-l border-border relative">
                  {isBest(benchmark.id, 'gemini3Pro') ? (
                    <span className="inline-block bg-primary text-bg px-2 py-1 font-bold border border-primary">
                      {formatValue(benchmark.data.gemini3Pro, benchmark.metricType)}
                    </span>
                  ) : (
                    <span className="text-text opacity-80">
                      {formatValue(benchmark.data.gemini3Pro, benchmark.metricType)}
                    </span>
                  )}
                </td>

                {/* Gemini 2.5 */}
                 <td className="px-6 py-4 border-l border-border">
                   <span className={`${isBest(benchmark.id, 'gemini25Pro') ? 'text-accent font-bold border-b-2 border-accent' : 'text-dim'}`}>
                     {formatValue(benchmark.data.gemini25Pro, benchmark.metricType)}
                   </span>
                </td>

                {/* Claude */}
                 <td className="px-6 py-4 border-l border-border">
                  <span className={`${isBest(benchmark.id, 'claudeSonnet45') ? 'text-accent font-bold border-b-2 border-accent' : 'text-dim'}`}>
                     {formatValue(benchmark.data.claudeSonnet45, benchmark.metricType)}
                  </span>
                </td>

                {/* GPT */}
                 <td className="px-6 py-4 border-l border-border">
                   <span className={`${isBest(benchmark.id, 'gpt51') ? 'text-accent font-bold border-b-2 border-accent' : 'text-dim'}`}>
                     {formatValue(benchmark.data.gpt51, benchmark.metricType)}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Bottom Strip */}
      {!readerMode && (
        <div className="h-2 bg-[repeating-linear-gradient(45deg,var(--color-border),var(--color-border)_10px,var(--color-surface)_10px,var(--color-surface)_20px)] border-2 border-t-0 border-dim"></div>
      )}
    </div>
  );
};

export default BenchmarkTable;