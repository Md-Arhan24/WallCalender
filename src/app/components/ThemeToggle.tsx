import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-5 right-5 w-14 h-7 rounded-full flex items-center px-1 transition-colors duration-300 z-50"
      style={{
        backgroundColor: isDark ? '#1A1A1A' : '#E5E7EB',
      }}
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-white flex items-center justify-center"
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5" style={{ color: '#818CF8' }} />
        ) : (
          <Sun className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
        )}
      </motion.div>
    </button>
  );
}
