import React from 'react';
import ThemeToggle from './theme-toggle';
import { SearchIcon, SettingsIcon, BellIcon, UserIcon } from 'lucide-react';
import { Button } from './button';

interface FuturisticToolbarProps {
  title?: string;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
}

/**
 * Barre d'outils futuriste avec animations et effets visuels
 * Adapté aux thèmes de 2026
 */
const FuturisticToolbar: React.FC<FuturisticToolbarProps> = ({
  title = 'Lotto Sylvain 2026',
  onSettingsClick,
  onProfileClick,
  onSearchClick,
  onNotificationsClick
}) => {
  return (
    <div className="sticky top-0 backdrop-blur-lg bg-background/80 border-b border-border z-50 px-4 py-3 flex justify-between items-center">
      {/* Logo et titre */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-white font-extrabold text-sm tracking-wide">Lotto Sylvain</span>
        </div>
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">{title}</h1>
      </div>
      
      {/* Actions */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSearchClick}
          className="rounded-full p-2 hover:bg-indigo-500/20"
        >
          <SearchIcon className="h-4 w-4 text-cyan-500" />
          <span className="sr-only">Rechercher</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onNotificationsClick}
          className="rounded-full p-2 hover:bg-indigo-500/20 relative"
        >
          <BellIcon className="h-4 w-4 text-cyan-500" />
          <span className="sr-only">Notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSettingsClick}
          className="rounded-full p-2 hover:bg-indigo-500/20"
        >
          <SettingsIcon className="h-4 w-4 text-cyan-500" />
          <span className="sr-only">Paramètres</span>
        </Button>
        
        <ThemeToggle />
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onProfileClick}
          className="rounded-full p-2 hover:bg-indigo-500/20"
        >
          <UserIcon className="h-4 w-4 text-cyan-500" />
          <span className="sr-only">Profil</span>
        </Button>
      </div>
    </div>
  );
};

export default FuturisticToolbar;
