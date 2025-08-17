
import React from 'react';
import ThemeToggle from './theme-toggle';
import { useTabStyle } from '../../../context/TabStyleContext';
import { useLanguage } from '../../../context/LanguageContext';
import { SearchIcon, SettingsIcon, BellIcon, UserIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarTitle } from '../ui/toolbar';

interface FuturisticToolbarProps {
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
}

/**
 * Barre d'outils simple et épurée pour l'application Lotto 649
 * Les boutons d'action sont alignés à droite, sans animations superflues
 */
const FuturisticToolbar: React.FC<FuturisticToolbarProps> = ({
  onSettingsClick,
  onProfileClick,
  onSearchClick,
  onNotificationsClick
}) => {
  const { styleMode, setStyleMode } = useTabStyle();
  const { lang, t, setLang } = useLanguage();

  const StyleSwitch: React.FC = () => (
    <div className="inline-flex rounded-lg p-1">
      <button
        type="button"
        onPointerDown={() => setStyleMode('pills')}
        onClick={() => setStyleMode('pills')}
  className={`px-3 py-1 rounded-md text-sm font-medium transition duration-150 ease-out will-change-transform ${
          styleMode === 'pills' ? '' : 'text-gray-600 dark:text-gray-300'
        }`}
        aria-pressed={styleMode === 'pills'}
      >
        Pills
      </button>
      <button
        type="button"
        onPointerDown={() => setStyleMode('segmented')}
        onClick={() => setStyleMode('segmented')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition duration-150 ease-out will-change-transform ${
          styleMode === 'segmented' ? '' : 'text-gray-600 dark:text-gray-300'
        }`}
        aria-pressed={styleMode === 'segmented'}
      >
        Segmented
      </button>
    </div>
  );

  const LanguageSwitch: React.FC = () => (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onPointerDown={() => setLang('fr')}
        onClick={() => setLang('fr')}
        className={`px-2 py-1 rounded-md flex items-center justify-center transition-transform duration-150 ease-out will-change-transform active:scale-95 active:shadow-lg ${lang === 'fr' ? 'bg-white dark:bg-slate-700' : ''}`}
        aria-pressed={lang === 'fr'}
        aria-label="Français"
        title="Français"
      >
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect width="6.666" height="14" x="0" y="0" fill="#0055A4" />
          <rect width="6.666" height="14" x="6.666" y="0" fill="#FFFFFF" />
          <rect width="6.666" height="14" x="13.332" y="0" fill="#EF4135" />
        </svg>
        <span className="sr-only">Français</span>
        <span className="hidden md:inline ml-2 text-xs text-gray-600 dark:text-gray-300">{t.languages.fr.abbrev}</span>
      </button>

      <button
        type="button"
        onPointerDown={() => setLang('en')}
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded-md flex items-center justify-center transition-transform duration-150 ease-out will-change-transform active:scale-95 active:shadow-lg ${lang === 'en' ? 'bg-white dark:bg-slate-700' : ''}`}
        aria-pressed={lang === 'en'}
        aria-label="English"
        title="English"
      >
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect width="20" height="14" fill="#012169" />
          <path d="M0 0 L20 14 M20 0 L0 14" stroke="#ffffff" strokeWidth="2" />
          <path d="M0 7 L20 7 M10 0 L10 14" stroke="#ffffff" strokeWidth="3" />
          <path d="M0 0 L20 14 M20 0 L0 14" stroke="#C8102E" strokeWidth="1" />
          <path d="M0 7 L20 7 M10 0 L10 14" stroke="#C8102E" strokeWidth="2" />
        </svg>
        <span className="sr-only">English</span>
        <span className="hidden md:inline ml-2 text-xs text-gray-600 dark:text-gray-300">{t.languages.en.abbrev}</span>
      </button>
    </div>
  );

  return (
    <div className="flex p-2 z-50 w-full">
      <Toolbar className="flex items-center justify-between">
        <ToolbarTitle>{t.toolbarTitle[lang]}</ToolbarTitle>

        <div className="flex items-center gap-2 sm:gap-3">
          <ToolbarButton asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchClick}
              aria-label={t.toolbarButtons.search[lang]}
            >
              <SearchIcon className="h-5 w-5 text-foreground" />
            </Button>
          </ToolbarButton>

          <ToolbarButton asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotificationsClick}
              aria-label={t.toolbarButtons.notifications[lang]}
            >
              <BellIcon className="h-5 w-5 text-foreground" />
            </Button>
          </ToolbarButton>

          <ToolbarButton asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              aria-label={t.toolbarButtons.settings[lang]}
            >
              <SettingsIcon className="h-5 w-5 text-foreground" />
            </Button>
          </ToolbarButton>

          <ToolbarSeparator />

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs">Style</span>
              <StyleSwitch />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <LanguageSwitch />
            </div>

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>

          <ToolbarButton asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfileClick}
              aria-label={t.toolbarButtons.profile[lang]}
            >
              <UserIcon className="h-5 w-5 text-foreground" />
            </Button>
          </ToolbarButton>
        </div>
      </Toolbar>
    </div>
  );
};

export default FuturisticToolbar;
