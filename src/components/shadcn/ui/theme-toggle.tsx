import React, { useEffect, useState } from 'react';
import { Switch } from './switch';
import { SunIcon, MoonIcon } from 'lucide-react';
import { Button } from './button';

/**
 * Composant de bascule de thème (sombre/clair) avec design futuriste amélioré
 * Utilise le composant Switch de shadcn/ui avec meilleur contraste visuel
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
    <div className="flex items-center space-x-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-md px-4 py-2 rounded-xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 rounded-lg transition-all duration-300 ${!isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'text-amber-400/50 hover:text-amber-400'}`}
      >
        <SunIcon className="h-4 w-4" />
      </Button>
      
      <Switch 
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-600 data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-amber-400 data-[state=unchecked]:to-orange-500 border-2 border-transparent shadow-lg"
      />
      
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'text-indigo-400/50 hover:text-indigo-400'}`}
      >
        <MoonIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ThemeToggle;
