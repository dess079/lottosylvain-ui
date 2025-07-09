import React, { useEffect, useState } from 'react';
import { Switch } from './switch';
import { SunIcon, MoonIcon } from 'lucide-react';

/**
 * Composant de bascule de thème (sombre/clair) avec design futuriste
 * Utilise le composant Switch de shadcn/ui
 */
const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    // Vérifier le thème initial
    const theme = localStorage.theme;
    const isLight = theme === 'light';
    setIsDarkMode(!isLight);
    
    // Appliquer le thème
    document.documentElement.classList.toggle('light', isLight);
    document.documentElement.classList.toggle('dark', !isLight);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  };

  return (
    <div className="flex items-center space-x-3 bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-500/20">
      <SunIcon className="h-4 w-4 text-cyan-500" />
      <Switch 
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
        className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-cyan-500/30"
      />
      <MoonIcon className="h-4 w-4 text-indigo-500" />
    </div>
  );
};

export default ThemeToggle;
