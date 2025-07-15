import React from 'react';
import ThemeToggle from './theme-toggle';
import { SearchIcon, SettingsIcon, BellIcon, UserIcon, SparklesIcon } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';

interface FuturisticToolbarProps {
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
}

/**
 * Barre d'outils futuriste avec animations et effets visuels
 * Adapté aux thèmes de 2026 avec espacement optimisé
 */
const FuturisticToolbar: React.FC<FuturisticToolbarProps> = ({
  onSettingsClick,
  onProfileClick,
  onSearchClick,
  onNotificationsClick
}) => {
  return (
    <div className="sticky top-4  mx-2 sm:mx-4 lg:mx-6 z-50 pt-2 sm:pt-4 lg:pt-6 ">
      <div className="backdrop-blur-xl bg-gradient-to-r from-background/90 via-background/95 to-background/90 border border-border/50 rounded-xl sm:rounded-2xl shadow-2xl shadow-indigo-500/10 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5">
        <div className="grid grid-cols-3 items-center gap-4">
          {/* Logo à gauche */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 justify-start">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 transform transition-transform hover:scale-105">
                <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full animate-bounce"></div>
            </div>
            <div className="hidden sm:block">
              <Badge variant="secondary" className="text-xs bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                Intelligence Artificielle
              </Badge>
            </div>
          </div>

          {/* Titre au centre */}
          <div className="flex justify-center">
            <div className="text-center">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">
                Lotto 649 - Analyse et Prédictions
              </h1>
              <p className="text-xs opacity-70 hidden lg:block">Explorez les données historiques et découvrez les prédictions IA</p>
            </div>
          </div>
          
          {/* Actions à droite */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSearchClick}
              className="rounded-lg sm:rounded-xl p-2 sm:p-3 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-cyan-500/10 transition-all duration-300 group"
            >
              <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
              <span className="sr-only">Rechercher</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNotificationsClick}
              className="rounded-lg sm:rounded-xl p-2 sm:p-3 hover:bg-gradient-to-r hover:from-rose-500/10 hover:to-orange-500/10 transition-all duration-300 group relative"
            >
              <BellIcon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 group-hover:text-rose-400 transition-colors" />
              <span className="sr-only">Notifications</span>
              <Badge className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs flex items-center justify-center animate-pulse">
                3
              </Badge>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSettingsClick}
              className="rounded-lg sm:rounded-xl p-2 sm:p-3 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-indigo-500/10 transition-all duration-300 group"
            >
              <SettingsIcon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 group-hover:text-purple-400 group-hover:rotate-45 transition-all duration-300" />
              <span className="sr-only">Paramètres</span>
            </Button>
            
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onProfileClick}
              className="rounded-lg sm:rounded-xl p-2 sm:p-3 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-300 group"
            >
              <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 group-hover:text-emerald-400 transition-colors" />
              <span className="sr-only">Profil</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuturisticToolbar;
