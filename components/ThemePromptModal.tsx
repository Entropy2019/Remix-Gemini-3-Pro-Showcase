
import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Terminal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemePromptModalProps {
  onClose: () => void;
}

const ThemePromptModal: React.FC<ThemePromptModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const { readerMode } = useTheme();

  const promptText = `
Act as a Senior UI/UX Engineer. Create a web application using React and Tailwind CSS with a "Cassette Futurism" / "Retro-Industrial Sci-Fi" aesthetic (Styles like Alien, Blade Runner, 80s Anime UI).

### 1. Color Palette (Define in Tailwind config or CSS variables)
- **Background**: Deep Void (#101012) or Slate-950.
- **Surface**: Dark Gray (#1c1c1f).
- **Primary Accent**: Amber/Gold (#ffb000) - Use for main actions and active states.
- **Secondary**: Retro Orange (#e05a00) - Use for alerts or secondary highlights.
- **Tertiary**: Teal/Cyan (#00a3a3) - Use for data visualization or HUD elements.
- **Text**: Off-White/Bone (#cec5b5) for contrast against dark backgrounds.
- **Dim**: Muted Gray (#6b6b6b) for secondary text.

### 2. Typography
- **Headings**: "Chakra Petch" or similar angular, futuristic sans-serif. Always Uppercase.
- **Body**: "Space Mono" or similar monospaced font.
- **Style**: High contrast, tracking-wide for headers, technical labeling style.

### 3. UI Components & Shape Language
- **No Rounded Corners**: Use \`rounded-none\` everywhere. Sharp 90-degree angles.
- **Borders**: Heavy usage of 1px or 2px solid borders (Colors: #333 or Accent colors).
- **Shadows**: "Hard" offset shadows. Example: \`box-shadow: 4px 4px 0px var(--primary-color)\`. No soft blur shadows.
- **Buttons**: Rectangular, uppercase text, solid borders. Hover effects should be harsh (e.g., invert colors or translate position 2px).
- **Cards**: Look like "Data Plates" or "Terminal Windows". Use decorative corner cuts or dashed lines.

### 4. Visual Effects (Atmosphere)
- **CRT Overlay**: Add a subtle scanline overlay or noise texture pointer-events-none on top of the app.
- **Animations**: Blinking cursors, "typing" effects for text, marquee scrolling for status bars.
- **Decorations**: Use technical labels (e.g., "SYS_READY", "MOD_01", "ERR_NULL") as decorative elements.
- **Grid**: Background patterns using faint 1px grids or dots.

### 5. Layout Philosophy
- **Dense**: High information density, dashboard-style.
- **Structural**: Use visible layout lines and dividers.
- **Terminal**: The interface should feel like a piece of hardware or a command-line terminal.

### Example Tailwind Classes to rely on:
\`border-2 border-amber-500 bg-zinc-900 text-zinc-100 font-mono uppercase tracking-widest shadow-[4px_4px_0px_rgba(255,176,0,1)]\`
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-bg w-full max-w-3xl flex flex-col border-2 border-dim shadow-[0_0_0_4px_rgba(0,0,0,0.5)] animate-modal-in">
        
        {/* Header */}
        <div className="bg-dim p-2 flex items-center justify-between border-b-2 border-bg">
          <div className="flex items-center gap-2 text-bg px-2">
            <FileCode className="w-4 h-4" />
            <span className="font-bold font-mono text-xs md:text-sm uppercase">
              SYSTEM_BLUEPRINT :: UI_PROMPT_EXPORT.TXT
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-bg hover:bg-bg hover:text-primary p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 relative overflow-hidden group">
          {!readerMode && (
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Terminal className="w-32 h-32" />
             </div>
          )}

          <div className="mb-4">
            <h3 className="text-primary font-bold font-mono uppercase text-lg mb-2">
              Generate Similar Styles
            </h3>
            <p className="text-dim text-xs font-mono mb-4">
              Copy this prompt to an AI assistant to replicate this "Cassette Futurism" aesthetic for other projects.
            </p>
          </div>

          <div className="relative">
            <textarea 
              readOnly
              value={promptText}
              className="w-full h-64 bg-surface border border-dim text-text font-mono text-xs p-4 focus:outline-none focus:border-primary resize-none"
            />
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 bg-primary text-bg p-2 hover:bg-secondary transition-colors border border-bg shadow-sm"
              title="Copy to Clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t-2 border-dim bg-surface flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 font-mono text-xs uppercase text-dim hover:text-text"
          >
            Cancel
          </button>
          <button 
            onClick={handleCopy}
            className="px-6 py-2 bg-primary text-bg font-bold font-mono text-xs uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_var(--color-dim)] transition-all border border-bg"
          >
            {copied ? 'COPIED!' : 'COPY_BLUEPRINT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemePromptModal;
