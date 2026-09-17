import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Terminal, X, ChevronRight } from 'lucide-react';
import { askGeminiAboutBenchmarks } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const InsightBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'TERMINAL_READY. 正在等待输入...' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { readerMode, chartColors } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await askGeminiAboutBenchmarks(userMessage, messages);
      setMessages(prev => [...prev, { role: 'model', text: response || "ERR_NO_RESPONSE" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "ERR_CONNECTION_FAILED" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end ${isOpen ? 'w-full max-w-md' : 'w-auto'}`}>
      {isOpen && (
        <div className="bg-bg border-2 border-secondary w-full mb-4 flex flex-col h-[500px] shadow-[8px_8px_0px_var(--color-border)] animate-in slide-in-from-bottom-10 duration-200">
          {/* Header */}
          <div className="bg-secondary p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="text-bg h-4 w-4" />
              <span className="text-bg font-bold font-mono text-sm uppercase">G3_ANALYSIS_BOT.EXE</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-bg hover:bg-bg hover:text-secondary transition-colors p-1 border border-transparent hover:border-bg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg scrollbar-thin font-mono relative">
             {/* Static noise background opacity */}
             {!readerMode && (
               <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
             )}

            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col relative z-10 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-dim mb-1 uppercase">
                    {msg.role === 'user' ? 'USER_INPUT >>' : 'SYSTEM_OUTPUT >>'}
                </span>
                <div 
                  className={`max-w-[90%] px-3 py-2 text-xs md:text-sm leading-relaxed border ${
                    msg.role === 'user' 
                      ? 'bg-surface-light text-text border-dim' 
                      : 'bg-surface text-primary border-secondary shadow-[2px_2px_0px_var(--color-secondary)]'
                  }`}
                >
                  {msg.text}
                  {msg.role === 'model' && idx === messages.length - 1 && !isLoading && !readerMode && (
                      <span className="inline-block w-2 h-4 bg-primary ml-1 animate-blink align-middle"></span>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col items-start relative z-10">
                <span className="text-[10px] text-dim mb-1">SYSTEM_PROCESS >></span>
                <div className="text-accent text-xs font-mono flex items-center">
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  PROCESSING_REQUEST...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 bg-surface border-t-2 border-secondary">
            <div className="relative flex items-center">
              <span className="text-secondary mr-2 font-mono font-bold">{'>'}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="TYPE COMMAND..."
                className="relative w-full bg-transparent text-text placeholder-dim border-none focus:ring-0 font-mono text-sm"
                autoFocus
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-secondary text-bg hover:bg-primary disabled:opacity-50 disabled:hover:bg-secondary transition-colors font-bold uppercase text-xs border border-bg"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="retro-btn px-6 py-3 flex items-center space-x-2 font-mono text-sm group"
        >
          <MessageSquare className="h-4 w-4" />
          <span>INIT_CHAT_MODULE</span>
        </button>
      )}
    </div>
  );
};

export default InsightBot;
