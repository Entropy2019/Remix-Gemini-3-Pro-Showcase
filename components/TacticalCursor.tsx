
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TacticalCursor: React.FC = () => {
  const { readerMode } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (readerMode) return;

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Using translate3d for GPU acceleration
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      // Update coordinates for the text display
      setCoords({ x: e.clientX, y: e.clientY });
      
      if (!isVisible) setIsVisible(true);
    };

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if the target or its parents are clickable
      const isClickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button';

      setIsHovering(!!isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', checkHover);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', checkHover);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [readerMode, isVisible]);

  if (readerMode) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ marginLeft: -20, marginTop: -20 }}
    >
      <div className="relative w-10 h-10 flex items-center justify-center">
        
        {/* Center Crosshair */}
        <div className={`absolute bg-primary transition-all duration-150 ${isHovering ? 'w-1 h-1 rounded-full' : 'w-[2px] h-[10px]'}`}></div>
        <div className={`absolute bg-primary transition-all duration-150 ${isHovering ? 'w-1 h-1 rounded-full' : 'w-[10px] h-[2px]'}`}></div>

        {/* Locking Brackets (Expand on Hover) */}
        <div 
          className={`absolute border-l-2 border-t-2 border-primary transition-all duration-200 ease-out`}
          style={{
            top: isHovering ? '0px' : '12px',
            left: isHovering ? '0px' : '12px',
            width: isHovering ? '10px' : '4px',
            height: isHovering ? '10px' : '4px',
            opacity: isHovering ? 1 : 0
          }}
        ></div>
        <div 
          className={`absolute border-r-2 border-t-2 border-primary transition-all duration-200 ease-out`}
          style={{
            top: isHovering ? '0px' : '12px',
            right: isHovering ? '0px' : '12px',
            width: isHovering ? '10px' : '4px',
            height: isHovering ? '10px' : '4px',
            opacity: isHovering ? 1 : 0
          }}
        ></div>
        <div 
          className={`absolute border-l-2 border-b-2 border-primary transition-all duration-200 ease-out`}
          style={{
            bottom: isHovering ? '0px' : '12px',
            left: isHovering ? '0px' : '12px',
            width: isHovering ? '10px' : '4px',
            height: isHovering ? '10px' : '4px',
            opacity: isHovering ? 1 : 0
          }}
        ></div>
        <div 
          className={`absolute border-r-2 border-b-2 border-primary transition-all duration-200 ease-out`}
          style={{
            bottom: isHovering ? '0px' : '12px',
            right: isHovering ? '0px' : '12px',
            width: isHovering ? '10px' : '4px',
            height: isHovering ? '10px' : '4px',
            opacity: isHovering ? 1 : 0
          }}
        ></div>

        {/* Outer Ring (Click Feedback) */}
        <div 
          className={`absolute border border-primary rounded-full transition-all duration-300`}
          style={{
             width: isClicking ? '30px' : '0px',
             height: isClicking ? '30px' : '0px',
             opacity: isClicking ? 1 : 0,
          }}
        ></div>

        {/* Coordinates Text */}
        <div className="absolute left-8 bottom-8 whitespace-nowrap">
           <div className="text-[8px] font-mono text-primary font-bold tracking-widest bg-bg/80 px-1">
             X:{coords.x} Y:{coords.y}
           </div>
           {isHovering && (
             <div className="text-[8px] font-mono text-secondary font-bold tracking-widest bg-bg/80 px-1 mt-[2px] animate-pulse">
               TARGET_LOCKED
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default TacticalCursor;
