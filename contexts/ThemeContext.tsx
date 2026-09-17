import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

interface ChartColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  dim: string;
  bg: string;
  surface: string;
  grid: string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  readerMode: boolean;
  toggleReaderMode: () => void;
  chartColors: ChartColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [readerMode, setReaderMode] = useState(false);

  // Computed colors for charts based on theme
  const chartColors: ChartColors = theme === 'dark' 
    ? {
        primary: '#ffb000',
        secondary: '#e05a00',
        accent: '#00a3a3',
        text: '#cec5b5',
        dim: '#6b6b6b',
        bg: '#101012',
        surface: '#1c1c1f',
        grid: '#333333'
      }
    : {
        primary: '#d97706',
        secondary: '#c2410c',
        accent: '#0f766e',
        text: '#18181b',
        dim: '#71717a',
        bg: '#f4f4f5',
        surface: '#ffffff',
        grid: '#d4d4d8'
      };

  useEffect(() => {
    // Apply theme to HTML element for CSS selectors
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  useEffect(() => {
    // Apply reader mode class to body
    if (readerMode) {
      document.body.classList.add('reader-mode');
    } else {
      document.body.classList.remove('reader-mode');
    }
  }, [readerMode]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleReaderMode = () => {
    setReaderMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, readerMode, toggleReaderMode, chartColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
