
import React from 'react';
import ThemeToggle from './theme-toggle';
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
  return (
    <div className="flex p-16 z-50 w-full">
      <Toolbar className="flex items-center justify-between">
        <ToolbarTitle>
          Lotto 649 - Analyse & Prédictions
        </ToolbarTitle>
        <div className="flex items-center gap-2 sm:gap-3">
          <ToolbarButton asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchClick}
              aria-label="Rechercher"
            >
              <SearchIcon className="h-5 w-5 text-foreground" />
            </Button>
          </ToolbarButton>
          <ToolbarButton asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotificationsClick}
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5 text-foreground" />
            </Button>
          </ToolbarButton>
          <ToolbarButton asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              aria-label="Paramètres"
            >
              <SettingsIcon className="h-5 w-5 text-foreground" />
            </Button>
          </ToolbarButton>
          <ToolbarSeparator />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <ToolbarButton asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfileClick}
              aria-label="Profil"
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
