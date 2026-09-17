
import React from 'react';
import { X, FileText, AlertTriangle, Terminal, CheckCircle2, XCircle } from 'lucide-react';
import { Benchmark } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface BenchmarkDetailModalProps {
  benchmark: Benchmark;
  onClose: () => void;
}

const BenchmarkDetailModal: React.FC<BenchmarkDetailModalProps> = ({ benchmark, onClose }) => {
  const { readerMode } = useTheme();
  const details = benchmark.details;

  if (!details) {
    return null; // Should ideally not happen if we only allow clicking on rows with details
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-bg w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-primary shadow-[0_0_40px_rgba(255,176,0,0.2)] flex flex-col retro-border animate-modal-in">
        
        {/* Header - File Folder Style */}
        <div className="bg-primary p-3 flex items-center justify-between sticky top-0 z-10 border-b-2 border-bg">
          <div className="flex items-center gap-3 text-bg">
            <FileText className="w-5 h-5" />
            <span className="font-bold font-mono text-sm md:text-base tracking-wider uppercase">
              CLASSIFIED // METRIC_ANALYSIS // {benchmark.id.toUpperCase()}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-bg hover:bg-bg hover:text-primary p-1 transition-colors border-2 border-transparent hover:border-bg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8 font-mono text-text relative">
           {/* Background Watermark */}
           {!readerMode && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
               <span className="text-[15vw] font-black -rotate-12 whitespace-nowrap">TOP SECRET</span>
            </div>
           )}

           {/* 1. Overview Section */}
           <section className="border-l-4 border-secondary pl-4">
              <h2 className="text-xl md:text-2xl font-bold text-text mb-2 uppercase flex items-center gap-2">
                 {benchmark.name}
                 <span className="text-xs bg-secondary text-bg px-2 py-0.5 rounded-sm align-middle">{benchmark.category}</span>
              </h2>
              <p className="text-dim text-sm md:text-base mb-4">{benchmark.explanation}</p>
              <div className="bg-surface p-3 border border-dim inline-block">
                 <span className="text-primary font-bold text-xs uppercase block mb-1">REALITY IMPACT</span>
                 <p className="text-text text-sm">{benchmark.realWorldImpact}</p>
              </div>
           </section>

           {/* 2. Challenge Definition */}
           <section>
              <div className="flex items-center gap-2 text-accent mb-3 border-b border-dim pb-1">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Mission Challenge</h3>
              </div>
              <div className="bg-surface border border-dim p-4 relative">
                 {!readerMode && <div className="absolute top-0 left-0 w-2 h-2 bg-accent"></div>}
                 <p className="text-lg font-bold text-text mb-2">{details.challenge}</p>
                 <div className="mt-3 text-xs text-dim uppercase mb-1">Input Prompt:</div>
                 <div className="bg-bg p-3 border border-dim font-mono text-xs md:text-sm text-text/90 italic">
                    "{details.input}"
                 </div>
              </div>
           </section>

           {/* 3. Head-to-Head Comparison */}
           <section>
              <div className="flex items-center gap-2 text-primary mb-3 border-b border-dim pb-1">
                <Terminal className="w-4 h-4" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Output Analysis</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gemini 3 Pro Result */}
                <div className="group relative">
                   <div className="absolute -top-3 left-4 bg-bg px-2 text-primary font-bold text-xs border border-primary uppercase z-10">
                      Gemini 3 Pro
                   </div>
                   <div className="bg-surface/50 border-2 border-primary p-5 h-full hover:bg-surface transition-colors">
                      <div className="flex items-start gap-3 mb-3">
                         <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                         <div className="text-sm text-text leading-relaxed">
                            {details.geminiOutput}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Competitor Result */}
                <div className="group relative">
                   <div className="absolute -top-3 left-4 bg-bg px-2 text-dim font-bold text-xs border border-dim uppercase z-10">
                      VS {details.competitorName}
                   </div>
                   <div className="bg-surface border-2 border-dim p-5 h-full hover:bg-surface/80 transition-colors">
                      <div className="flex items-start gap-3 mb-3">
                         <XCircle className="w-6 h-6 text-dim flex-shrink-0 mt-1" />
                         <div className="text-sm text-text/80 leading-relaxed">
                            {details.competitorOutput}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
           </section>

           {/* 4. Final Verdict */}
           <section className="bg-secondary/10 border border-secondary p-4 text-center">
              <h4 className="text-secondary font-bold uppercase text-xs mb-2">TACTICAL ADVANTAGE</h4>
              <p className="text-text text-sm md:text-base font-bold">
                 {details.analysis}
              </p>
           </section>

        </div>
        
        {/* Footer Strip */}
        <div className="bg-surface border-t-2 border-dim p-2 text-[10px] text-dim font-mono uppercase flex justify-between">
           <span>SECURE CONNECTION ESTABLISHED</span>
           <span>DOC_ID: {benchmark.id}_V3</span>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkDetailModal;
