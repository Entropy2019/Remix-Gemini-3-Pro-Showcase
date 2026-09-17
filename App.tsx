
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Hero from './components/Hero';
import BenchmarkTable from './components/BenchmarkTable';
import PerformanceChart from './components/PerformanceChart';
import VisualComparison from './components/VisualComparison';
import InsightBot from './components/InsightBot';
import BenchmarkDetailModal from './components/BenchmarkDetailModal';
import ThemePromptModal from './components/ThemePromptModal';
import WelcomeScreen from './components/WelcomeScreen';
import TacticalCursor from './components/TacticalCursor';
import ScrollReveal from './components/ScrollReveal';
import { ExternalLink, Radio, Sun, Moon, Eye, EyeOff, FileCode, Volume2, VolumeX, Music } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Benchmark } from './types';

interface Track {
  title: string;
  artist: string;
  url: string;
}

// Playlist of retro/synthwave tracks
const PLAYLIST: Track[] = [
  {
    title: "Synthwave 80s",
    artist: "Grand_Project",
    url: "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c58bd.mp3"
  },
  {
    title: "Cyberpunk City",
    artist: "Viktor Kraus",
    url: "https://cdn.pixabay.com/audio/2021/11/24/audio_823c99a467.mp3"
  },
  {
    title: "Neon Horizon",
    artist: "Grand_Project",
    url: "https://cdn.pixabay.com/audio/2024/01/16/audio_e2b992254f.mp3"
  }
];

const AppContent: React.FC = () => {
  const { theme, toggleTheme, readerMode, toggleReaderMode } = useTheme();
  const [selectedBenchmark, setSelectedBenchmark] = useState<Benchmark | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  
  // System State
  const [showWelcome, setShowWelcome] = useState(true);
  const [isWelcomeExiting, setIsWelcomeExiting] = useState(false);
  
  // Audio State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Ref to track the last played track index to prevent unnecessary reloads
  const lastTrackIndexRef = useRef(currentTrackIndex);

  // Auto-play next track when current one ends
  const handleTrackEnd = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  }, []);

  // Handle load errors by skipping to the next track
  const handleTrackError = useCallback(() => {
    console.warn(`Track ${currentTrackIndex} failed to load. Skipping...`);
    handleTrackEnd();
  }, [currentTrackIndex, handleTrackEnd]);

  // Effect to handle track switching while playing
  useEffect(() => {
    // Only run logic if we have the audio element
    if (!audioRef.current) return;

    // Check if the track actually changed
    if (lastTrackIndexRef.current !== currentTrackIndex) {
      lastTrackIndexRef.current = currentTrackIndex;
      
      // If currently playing, we need to load the new source and play
      if (isAudioPlaying) {
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
             // AbortError is expected if the user skips tracks quickly
             if (error.name !== 'AbortError') {
               console.error("Playback failed during track change:", error);
             }
          });
        }
      } else {
        // Even if not playing, load the new source so it's ready
        audioRef.current.load();
      }
    }
  }, [currentTrackIndex, isAudioPlaying]);

  // Called immediately when user clicks the "Initialize System" button on Welcome Screen
  const handleSystemStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsAudioPlaying(true);
          })
          .catch((error) => {
            console.error("Audio playback failed even after interaction:", error);
          });
      }
    }

    // Delay removing the welcome screen to allow the boot animation to play
    setTimeout(() => {
      // Trigger exit animation
      setIsWelcomeExiting(true);
      
      // Wait for animation to finish before unmounting
      setTimeout(() => {
        setShowWelcome(false);
      }, 600);
    }, 3500);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsAudioPlaying(true);
        }).catch(e => console.error(e));
      }
    }
  };

  return (
    <div className="min-h-screen font-mono text-text relative bg-bg transition-colors duration-300">
      
      <TacticalCursor />

      {/* Background Audio - Playlist Loop */}
      <audio 
        ref={audioRef} 
        crossOrigin="anonymous"
        onEnded={handleTrackEnd}
        onError={handleTrackError}
      >
        <source src={PLAYLIST[currentTrackIndex].url} type="audio/mp3" />
      </audio>

      {/* Global Effects */}
      {!readerMode && !showWelcome && (
        <>
          <div className="crt-overlay"></div>
          <div className="scanline"></div>
        </>
      )}

      {/* Welcome / Boot Screen Overlay */}
      {showWelcome && (
        <WelcomeScreen onStart={handleSystemStart} isExiting={isWelcomeExiting} />
      )}

      {/* Navbar */}
      <nav className="bg-surface border-b-2 border-border sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              {/* Logo mark */}
              <div className="w-8 h-8 bg-primary flex items-center justify-center border-2 border-secondary">
                <span className="text-bg font-black text-lg">G</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold tracking-wider text-text uppercase">Gemini Corp</span>
                <span className="text-[10px] text-dim">MODEL: 3_PRO</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 md:space-x-6 text-xs md:text-sm">
              <div className="flex items-center bg-surface-light rounded border border-border p-1 gap-1">
                 <button 
                   onClick={() => setShowPromptModal(true)}
                   className="p-1.5 hover:bg-bg rounded text-dim hover:text-primary transition-colors"
                   title="获取UI提示词 (Get Design Prompt)"
                 >
                   <FileCode className="w-4 h-4" />
                 </button>
                 <div className="w-[1px] h-4 bg-border"></div>
                 
                 {/* Audio Toggle & Info */}
                 <div className="flex items-center">
                   <button 
                     onClick={toggleAudio} 
                     className={`p-1.5 hover:bg-bg rounded transition-colors ${isAudioPlaying ? 'text-primary animate-pulse' : 'text-dim hover:text-primary'}`}
                     title={isAudioPlaying ? "关闭背景音乐 (Mute BGM)" : "开启背景音乐 (Play BGM)"}
                   >
                     {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                   </button>
                   
                   {/* Now Playing Marquee */}
                   <div className="hidden lg:flex items-center gap-2 ml-1 px-2 border-l border-border/50 w-32 overflow-hidden">
                      <Music className={`w-3 h-3 ${isAudioPlaying ? 'text-secondary animate-spin' : 'text-dim'}`} style={{animationDuration: '3s'}} />
                      <div className="text-[10px] font-mono text-dim whitespace-nowrap overflow-hidden">
                         {isAudioPlaying ? (
                           <span className="animate-pulse">{PLAYLIST[currentTrackIndex].title}</span>
                         ) : (
                           <span>AUDIO_OFF</span>
                         )}
                      </div>
                   </div>
                 </div>
                 
                 <div className="w-[1px] h-4 bg-border"></div>
                 <button 
                   onClick={toggleReaderMode} 
                   className="p-1.5 hover:bg-bg rounded text-dim hover:text-primary transition-colors"
                   title={readerMode ? "开启特效 (High Fidelity)" : "开启阅读模式 (Reader Mode)"}
                 >
                   {readerMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                 </button>
                 <div className="w-[1px] h-4 bg-border"></div>
                 <button 
                   onClick={toggleTheme} 
                   className="p-1.5 hover:bg-bg rounded text-dim hover:text-primary transition-colors"
                   title={theme === 'dark' ? "切换亮色模式" : "切换暗色模式"}
                 >
                   {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                 </button>
              </div>

              <div className="hidden md:flex items-center space-x-6">
                <a href="https://deepmind.google/" target="_blank" rel="noopener noreferrer" className="text-dim hover:text-primary uppercase tracking-wider flex items-center gap-1 group">
                  <span className="group-hover:underline decoration-primary">DeepMind</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-border">|</span>
                <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-dim hover:text-primary uppercase tracking-wider group">
                   <span className="group-hover:underline decoration-primary">API_DOCS</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className={`relative z-10 pb-32 ${!showWelcome ? 'animate-fade-in' : 'opacity-0'}`}>
        <ScrollReveal>
          <Hero onSelectBenchmark={setSelectedBenchmark} />
        </ScrollReveal>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
          
          {/* New Intuitive Visuals Section */}
          <section>
            <ScrollReveal direction="left" delay={100}>
               <div className="mb-8 flex items-center justify-between border-b-2 border-border pb-4">
                  <div className="flex items-center gap-3">
                      <div className="h-4 w-4 bg-secondary animate-pulse"></div>
                      <h2 className="text-2xl font-bold text-text uppercase tracking-wide">
                        BATTLE_SIMULATION.EXE
                      </h2>
                  </div>
                  <div className="hidden md:block font-mono text-xs text-dim">
                      COMPARING: GEMINI 3 PRO VS SOTA
                  </div>
               </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
               <VisualComparison />
            </ScrollReveal>
          </section>

          {/* Visual Analytics Section */}
          <section>
             <ScrollReveal direction="left">
               <div className="mb-6 flex items-center gap-3">
                  <div className="h-4 w-4 bg-accent"></div>
                  <h2 className="text-2xl font-bold text-text uppercase tracking-wide">
                    FULL_DATA_PLOT.DAT
                  </h2>
               </div>
             </ScrollReveal>
             <ScrollReveal direction="up" delay={200}>
               <PerformanceChart />
             </ScrollReveal>
          </section>

          {/* Raw Data Section */}
          <section>
             <ScrollReveal direction="left">
               <div className="mb-6 flex items-center gap-3">
                  <div className="h-4 w-4 bg-primary"></div>
                  <h2 className="text-2xl font-bold text-text uppercase tracking-wide">
                    RAW_BENCHMARKS.TXT
                  </h2>
               </div>
             </ScrollReveal>
             <ScrollReveal direction="up" delay={200}>
               <BenchmarkTable onSelectBenchmark={setSelectedBenchmark} />
             </ScrollReveal>
          </section>

          {/* Call to Action */}
          <ScrollReveal direction="up" delay={100} className="w-full">
            <section className="bg-surface border-2 border-dim p-8 md:p-12 text-center relative overflow-hidden shadow-[8px_8px_0px_var(--color-border)]">
              {/* Diagonal Stripes Background */}
              {!readerMode && (
                <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(45deg, var(--color-border), var(--color-border) 10px, transparent 10px, transparent 20px)'}}></div>
              )}
              
              <div className="relative z-10">
                <Radio className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse" />
                <h2 className="text-3xl md:text-5xl font-black text-text uppercase mb-6 tracking-tighter">
                  READY TO <span className="text-secondary bg-bg px-2 border border-secondary">DEPLOY</span>?
                </h2>
                <p className="text-dim font-mono mb-8 max-w-2xl mx-auto">
                  INITIALIZE GEMINI 3 PRO PROTOCOLS. INTEGRATION STATUS: STANDBY.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a 
                    href="https://aistudio.google.com/"
                    className="retro-btn px-8 py-4 text-bg font-bold tracking-widest inline-block"
                  >
                    [ GET_API_KEY ]
                  </a>
                  <a 
                    href="#"
                    className="px-8 py-4 border-2 border-dim text-dim hover:text-text hover:border-text font-bold tracking-widest uppercase transition-colors"
                  >
                    READ_REPORT
                  </a>
                </div>
              </div>
            </section>
          </ScrollReveal>

        </div>
      </main>

      {/* Footer */}
      <footer className={`bg-bg border-t-2 border-border py-8 ${!showWelcome ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-dim font-mono uppercase">
            &copy; 2025 BENCHMARK_SHOWCASE // UNOFFICIAL_TERMINAL // END_OF_LINE
          </p>
        </div>
      </footer>

      <InsightBot />

      {/* Details Modal */}
      {selectedBenchmark && (
        <BenchmarkDetailModal 
          benchmark={selectedBenchmark} 
          onClose={() => setSelectedBenchmark(null)} 
        />
      )}

      {/* Prompt Modal */}
      {showPromptModal && (
        <ThemePromptModal onClose={() => setShowPromptModal(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
