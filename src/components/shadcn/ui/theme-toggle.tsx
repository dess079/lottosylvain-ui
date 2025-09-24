import React, { useEffect } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import { Button } from './button';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';

/**
 * Composant de bascule de thème (sombre/clair) avec design futuriste amélioré
 * Utilise le composant Switch de shadcn/ui avec meilleur contraste visuel
 */
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Appliquer le thème au document
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const { lang, t } = useLanguage();

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? t.theme.switchToLight[lang] : t.theme.switchToDark[lang]}
        className="p-2 rounded-md"
      >
        {theme === 'dark' ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-indigo-400" />}
      </Button>
    </div>
  );
};

export default ThemeToggle;
