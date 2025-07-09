import React from 'react';
import { cn } from '../../../lib/utils';

interface FuturisticDataDisplayProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

/**
 * Affichage de données futuriste avec effets visuels
 * Conçu pour les affichages de statistiques et données numériques
 */
const FuturisticDataDisplay: React.FC<FuturisticDataDisplayProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'primary',
  trend,
  trendValue,
  className
}) => {
  const variantStyles = {
    primary: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30',
    secondary: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
    accent: 'from-rose-500/20 to-rose-500/5 border-rose-500/30'
  };

  const trendStyles = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <div 
      className={cn(
        'relative p-4 rounded-xl backdrop-blur-lg bg-gradient-to-b border',
        variantStyles[variant],
        'card-hover-effect',
        className
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium opacity-70">{title}</h3>
        {icon && (
          <div className="p-2 rounded-full bg-background/50 backdrop-blur-md">
            {icon}
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs opacity-60 mt-1">{subtitle}</p>
        )}
      </div>
      
      {trend && trendValue && (
        <div className={cn('text-xs font-medium mt-3 flex items-center', trendStyles[trend])}>
          <span className="mr-1">{trendIcons[trend]}</span>
          {trendValue}
        </div>
      )}
      
      {/* Effet de brillance */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/5 pointer-events-none"></div>
    </div>
  );
};

export default FuturisticDataDisplay;
