
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number; // ms
  threshold?: number; // 0-1
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = "", 
  direction = 'up', 
  delay = 0,
  threshold = 0.15
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { readerMode } = useTheme();

  useEffect(() => {
    // In Reader Mode, we disable animations for accessibility/readability
    if (readerMode) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [readerMode, threshold]);

  const getTransformStyle = () => {
    // If animations are disabled (reader mode) or component is visible, reset transform
    if (isVisible || readerMode) return 'opacity-100 translate-x-0 translate-y-0';

    // Hidden states based on direction
    switch(direction) {
      case 'up': return 'opacity-0 translate-y-12';
      case 'down': return 'opacity-0 -translate-y-12';
      case 'left': return 'opacity-0 translate-x-12';
      case 'right': return 'opacity-0 -translate-x-12';
      case 'none': return 'opacity-0 scale-95';
      default: return 'opacity-0 translate-y-12';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${getTransformStyle()} ${className}`}
      style={{ transitionDelay: `${readerMode ? 0 : delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
