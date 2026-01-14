import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
      title={`Mode ${theme === 'light' ? 'sombre' : 'clair'}`}
    >
      <div className="theme-toggle-icon">
        {theme === 'light' ? (
          <FaMoon className="icon" />
        ) : (
          <FaSun className="icon" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
