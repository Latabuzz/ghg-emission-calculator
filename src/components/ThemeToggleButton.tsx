'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

// Alternative theme toggle - simple button version for headers/toolbars
export default function ThemeToggleButton() {
  const { theme, toggleTheme, mounted } = useTheme();
  
  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="p-2 rounded-lg w-9 h-9" />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'light' ? (
          <Sun className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
        ) : (
          <Moon className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
        )}
      </motion.div>
    </motion.button>
  );
}
