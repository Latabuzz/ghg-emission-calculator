'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  
  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="w-14 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 cursor-pointer transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {/* Toggle Circle */}
      <motion.div
        className="absolute w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md flex items-center justify-center"
        animate={{
          x: theme === 'light' ? 0 : 24,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === 'light' ? (
          <Sun className="w-4 h-4 text-yellow-500" />
        ) : (
          <Moon className="w-4 h-4 text-blue-400" />
        )}
      </motion.div>
      
      {/* Background Icons */}
      <div className="flex items-center justify-between w-full px-1.5 pointer-events-none">
        <Sun className={`w-3 h-3 transition-opacity ${theme === 'light' ? 'opacity-0' : 'opacity-50'} text-yellow-500`} />
        <Moon className={`w-3 h-3 transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-50'} text-gray-500`} />
      </div>
    </motion.button>
  );
}
