import React from 'react';
import { cn } from '../../../lib/utils';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  type?: 'regular' | 'bonus' | 'prediction';
  isHighlighted?: boolean;
  className?: string;
}

/**
 * Composant de boule de lotto avec effet 3D et animations
 * Utilisé pour afficher les numéros tirés et les prédictions
 */
const LottoBall: React.FC<LottoBallProps> = ({
  number,
  size = 'md',
  type = 'regular',
  isHighlighted = false,
  className
}) => {
  // Tailles des boules
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-20 h-20 text-xl'
  };
  
  // Types de boules
  const typeClasses = {
    regular: 'bg-gradient-to-b from-indigo-500 to-indigo-700 shadow-indigo-500/50',
    bonus: 'bg-gradient-to-b from-amber-500 to-amber-700 shadow-amber-500/50',
    prediction: 'bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-emerald-500/50'
  };
  
  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white shadow-lg transform transition-all duration-300',
        sizeClasses[size],
        typeClasses[type],
        isHighlighted && 'ring-2 ring-white/50 animate-pulse-glow scale-110',
        className
      )}
      style={{
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        boxShadow: `
          inset 0 -4px 8px rgba(0,0,0,0.2),
          inset 0 2px 4px rgba(255,255,255,0.4),
          0 8px 16px -2px rgba(0,0,0,0.2)
        `
      }}
    >
      {number}
    </div>
  );
};

export default LottoBall;