import React, { useEffect, useState } from 'react';
import { Switch } from './switch';
import { SunIcon, MoonIcon } from 'lucide-react';

/**
 * Composant de bascule de thème (clair/sombre)
 * Utilise le composant Switch de shadcn/ui
 */
const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Vérifier le thème initial
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <SunIcon className="h-5 w-5 text-yellow-300" />
      <Switch 
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <MoonIcon className="h-5 w-5 text-primary-100" />
    </div>
  );
};

export default ThemeToggle;
