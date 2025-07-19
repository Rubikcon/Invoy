import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export default function DarkModeToggle({ isDarkMode, onToggle }: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label="Toggle dark mode"
    >
      <div
        className={`absolute top-1 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-md transform transition-all duration-300 ease-in-out flex items-center justify-center ${
          isDarkMode ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDarkMode ? (
          <Moon size={12} className="text-gray-700" />
        ) : (
          <Sun size={12} className="text-yellow-500" />
        )}
      </div>
    </button>
  );
}