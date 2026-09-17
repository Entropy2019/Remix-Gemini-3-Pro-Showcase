
import React, { useState, useEffect } from 'react';
import { Power, Terminal, Cpu, ShieldCheck, Wifi } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  isExiting?: boolean;
}

const BOOT_LOGS = [
  "LOADING_KERNEL... OK",
  "MOUNTING_FILESYSTEM... READ_ONLY",
  "INIT_GRAPHICS_DRIVER... V3.0_PRO",
  "CONNECTING_NEURAL_LINK... ESTABLISHED",
  "BYPASSING_SECURITY_PROTOCOLS... SUCCESS",
  "LOADING_BENCHMARK_DATA... 100%",
  "CALIBRATING_SENSORS...",
  "OPTIMIZING_RUNTIME_ENVIRONMENT...",
  "SYSTEM_READY"
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, isExiting }) => {
  const [bootStep, setBootStep] = useState<'idle' | 'booting'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const handleInitialize = () => {
    // 1. Trigger audio (handled by parent immediately on click)
    onStart();
    
    // 2. Start visual sequence
    setBootStep('booting');
  };

  useEffect(() => {
    if (bootStep === 'booting') {
      // Log sequence
      let logIndex = 0;
      const logInterval = setInterval(() => {
        if (logIndex < BOOT_LOGS.length) {
          setLogs(prev => [...prev, BOOT_LOGS[logIndex]]);
          logIndex++;
        } else {
          clearInterval(logInterval);
        }
      }, 200);

      // Progress bar
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          // Random increments for realistic feel
          return prev + Math.random() * 5;
        });
      }, 100);

      return () => {
        clearInterval(logInterval);
        clearInterval(progressInterval);
      };
    }
  }, [bootStep]);

  return (
    <div className={`fixed inset-0 z-[100] bg-[#101012] flex flex-col items-center justify-center text-[#ffb000] font-mono p-4 overflow-hidden ${isExiting ? 'crt-turn-off' : ''}`}>
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(#ffb000 1px, transparent 1px), linear-gradient(90deg, #ffb000 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* CRT Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,6px_100%]"></div>

      <div className="relative z-30 max-w-2xl w-full">
        
        {/* IDLE STATE */}
        {bootStep === 'idle' && (
          <div className="text-center space-y-12 animate-in fade-in duration-1000">
            <div className="space-y-4">
              <div className="inline-block border-4 border-[#ffb000] p-4 mb-6 shadow-[0_0_20px_rgba(255,176,0,0.3)]">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase">
                  Gemini
                </h1>
                <div className="text-right text-xl bg-[#ffb000] text-[#101012] px-2 font-bold">
                  3_PRO_EDITION
                </div>
              </div>
              <p className="text-[#cec5b5] tracking-[0.2em] text-sm uppercase animate-pulse">
                Secure Terminal Access Required
              </p>
            </div>

            <button
              onClick={handleInitialize}
              className="group relative inline-flex items-center justify-center px-12 py-6 text-lg font-bold uppercase tracking-widest text-[#101012] bg-[#ffb000] hover:bg-[#e05a00] transition-all duration-300 shadow-[8px_8px_0px_#333] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <Power className="w-6 h-6 mr-3 group-hover:animate-spin" />
              [ INITIALIZE_SYSTEM ]
            </button>

            <div className="grid grid-cols-3 gap-4 text-[#6b6b6b] text-xs mt-12 opacity-50">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-6 h-6 mb-2" />
                <span>ENCRYPTED</span>
              </div>
              <div className="flex flex-col items-center">
                <Cpu className="w-6 h-6 mb-2" />
                <span>NEURAL_NET</span>
              </div>
              <div className="flex flex-col items-center">
                <Wifi className="w-6 h-6 mb-2" />
                <span>ONLINE</span>
              </div>
            </div>
          </div>
        )}

        {/* BOOTING STATE */}
        {bootStep === 'booting' && (
          <div className="w-full max-w-lg mx-auto border-2 border-[#ffb000] p-6 bg-[#1c1c1f] shadow-[0_0_30px_rgba(255,176,0,0.2)]">
            <div className="flex items-center justify-between border-b border-[#333] pb-2 mb-4">
               <span className="flex items-center gap-2 text-sm font-bold">
                 <Terminal className="w-4 h-4" /> BOOT_SEQUENCE.EXE
               </span>
               <span className="animate-pulse text-xs">PROCESSING...</span>
            </div>

            <div className="h-48 overflow-hidden font-mono text-xs space-y-1 mb-4 text-[#cec5b5]">
              {logs.map((log, idx) => (
                <div key={idx} className="truncate">
                  <span className="text-[#6b6b6b] mr-2">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-[#ffb000]">{'>'}</span> {log}
                </div>
              ))}
              <div className="animate-blink">_</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs uppercase">
                <span>System Integrity</span>
                <span>{Math.min(100, Math.floor(progress))}%</span>
              </div>
              <div className="h-4 bg-[#101012] border border-[#333] p-[2px]">
                <div 
                  className="h-full bg-[#ffb000] transition-all duration-100 ease-out"
                  style={{ width: `${Math.min(100, progress)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
