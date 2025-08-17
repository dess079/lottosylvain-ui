import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import { Button } from './button';
import { useLanguage } from '../../../context/LanguageContext';

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

  const { lang, t } = useLanguage();

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        aria-label={isDarkMode ? t.theme.switchToLight[lang] : t.theme.switchToDark[lang]}
        className="p-2 rounded-md"
      >
        {isDarkMode ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-indigo-400" />}
      </Button>
    </div>
  );
};

export default ThemeToggle;
