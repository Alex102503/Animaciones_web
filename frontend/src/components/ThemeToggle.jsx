import React from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="theme-btn">
      {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
    </button>
  );
}