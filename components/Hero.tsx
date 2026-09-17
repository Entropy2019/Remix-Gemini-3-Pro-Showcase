import React from 'react';
import { Disc, Cpu, Terminal, BarChart3 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { BENCHMARK_DATA } from '../constants';
import { Benchmark } from '../types';

interface HeroProps {
  onSelectBenchmark?: (benchmark: Benchmark) => void;
}

const Hero: React.FC<HeroProps> = ({ onSelectBenchmark }) => {
  const { readerMode, chartColors } = useTheme();

  const handleCardClick = (id: string) => {
    const benchmark = BENCHMARK_DATA.find(b => b.id === id);
    if (benchmark && onSelectBenchmark) {
      onSelectBenchmark(benchmark);
    }
  };

  return (
    <div className="relative pb-20 pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b-4 border-dashed border-border">
      {/* Background Grid Pattern */}
      {!readerMode && (
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
            style={{
              backgroundImage: `linear-gradient(${chartColors.primary} 1px, transparent 1px), linear-gradient(90deg, ${chartColors.primary} 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 border-l-8 border-primary pl-6 py-2">
          <div>
            <div className="flex items-center gap-2 text-secondary mb-2">
              <span className="w-3 h-3 bg-secondary animate-blink"></span>
              <span className="font-mono text-sm tracking-widest">SYSTEM_INIT :: V3.0_PRO</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-text tracking-tighter uppercase leading-none">
              Gemini <span className="text-primary bg-surface-light px-2">3 Pro</span>
            </h1>
          </div>
          <div className="mt-6 md:mt-0 font-mono text-xs text-dim text-right hidden md:block">
            <div>MEM: 1024TB OK</div>
            <div>CPU: NEURAL_LINK OK</div>
            <div>SYNC: 100%</div>
          </div>
        </div>
          
        <p className="mt-8 max-w-3xl text-xl text-text font-mono border-t-2 border-border pt-6">
          <span className="text-primary mr-2">{'>'}</span>
          重新定义智能极限。从极致推理到自主代理工作流，在所有关键维度全面超越。
          {!readerMode && <span className="inline-block w-2 h-5 bg-primary ml-1 animate-blink align-middle"></span>}
        </p>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {/* Card 1 - Humanity's Last Exam */}
          <div 
            onClick={() => handleCardClick('humanity')}
            role="button"
            tabIndex={0}
            className="bg-surface border-2 border-dim p-6 relative shadow-[8px_8px_0px_var(--color-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_var(--color-border)] hover:border-primary transition-all group cursor-pointer"
          >
            <div className="absolute top-0 left-0 bg-primary text-bg text-[10px] font-bold px-2 py-1">MOD_01</div>
            <div className="mt-6 mb-4 flex justify-between items-end border-b-2 border-border pb-2">
              <Cpu className="h-8 w-8 text-secondary" />
              <span className="text-4xl font-bold text-text group-hover:text-primary transition-colors">73%</span>
            </div>
            <h3 className="font-bold text-primary text-lg mb-2 uppercase">极致推理</h3>
            <p className="text-xs text-text font-mono leading-relaxed">
              Humanity's Last Exam 准确率大幅提升。逻辑核心已升级。
            </p>
            {!readerMode && (
              <>
                <div className="absolute bottom-2 right-2 text-border">+</div>
                <div className="absolute bottom-2 left-2 text-border">+</div>
                <div className="absolute top-2 right-2 text-border">+</div>
              </>
            )}
          </div>

          {/* Card 2 - Vending Bench */}
          <div 
            onClick={() => handleCardClick('vending')}
            role="button"
            tabIndex={0}
            className="bg-surface border-2 border-dim p-6 relative shadow-[8px_8px_0px_var(--color-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_var(--color-border)] hover:border-accent transition-all group cursor-pointer"
          >
             <div className="absolute top-0 left-0 bg-accent text-bg text-[10px] font-bold px-2 py-1">MOD_02</div>
            <div className="mt-6 mb-4 flex justify-between items-end border-b-2 border-border pb-2">
              <Disc className="h-8 w-8 text-accent" />
              <span className="text-4xl font-bold text-text group-hover:text-accent transition-colors">10x</span>
            </div>
            <h3 className="font-bold text-accent text-lg mb-2 uppercase">长程代理</h3>
            <p className="text-xs text-text font-mono leading-relaxed">
              任务序列化处理能力增强。净值收益最大化。
            </p>
             {!readerMode && (
              <>
                <div className="absolute bottom-2 right-2 text-border">+</div>
                <div className="absolute bottom-2 left-2 text-border">+</div>
                <div className="absolute top-2 right-2 text-border">+</div>
              </>
            )}
          </div>

          {/* Card 3 - LiveCodeBench */}
          <div 
            onClick={() => handleCardClick('livecode')}
            role="button"
            tabIndex={0}
            className="bg-surface border-2 border-dim p-6 relative shadow-[8px_8px_0px_var(--color-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_var(--color-border)] hover:border-secondary transition-all group cursor-pointer"
          >
             <div className="absolute top-0 left-0 bg-secondary text-bg text-[10px] font-bold px-2 py-1">MOD_03</div>
            <div className="mt-6 mb-4 flex justify-between items-end border-b-2 border-border pb-2">
              <Terminal className="h-8 w-8 text-primary" />
              <span className="text-4xl font-bold text-text group-hover:text-secondary transition-colors">2.4k</span>
            </div>
            <h3 className="font-bold text-secondary text-lg mb-2 uppercase">代码合成</h3>
            <p className="text-xs text-text font-mono leading-relaxed">
              LiveCodeBench 评分突破。算法生成模块优化完毕。
            </p>
             {!readerMode && (
              <>
                <div className="absolute bottom-2 right-2 text-border">+</div>
                <div className="absolute bottom-2 left-2 text-border">+</div>
                <div className="absolute top-2 right-2 text-border">+</div>
              </>
            )}
          </div>

           {/* Card 4 - ScreenSpot */}
           <div 
            onClick={() => handleCardClick('screenspot')}
            role="button"
            tabIndex={0}
            className="bg-surface border-2 border-dim p-6 relative shadow-[8px_8px_0px_var(--color-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_var(--color-border)] hover:border-text transition-all group cursor-pointer"
           >
             <div className="absolute top-0 left-0 bg-text text-bg text-[10px] font-bold px-2 py-1">MOD_04</div>
            <div className="mt-6 mb-4 flex justify-between items-end border-b-2 border-border pb-2">
              <BarChart3 className="h-8 w-8 text-text" />
              <span className="text-4xl font-bold text-text group-hover:text-text transition-colors">72%</span>
            </div>
            <h3 className="font-bold text-text text-lg mb-2 uppercase">视觉解析</h3>
            <p className="text-xs text-text font-mono leading-relaxed">
              屏幕 UI 语义理解。像素级数据提取。
            </p>
             {!readerMode && (
              <>
                <div className="absolute bottom-2 right-2 text-border">+</div>
                <div className="absolute bottom-2 left-2 text-border">+</div>
                <div className="absolute top-2 right-2 text-border">+</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;