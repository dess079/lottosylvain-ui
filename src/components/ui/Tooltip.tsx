import React from 'react';
import { cn } from '../../lib/utils';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

/**
 * A tooltip component that shows additional information on hover
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className
}) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2',
    left: 'right-full top-1/2 transform -translate-x-2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform translate-x-2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group">
      {children}
      <div
        className={cn(
          'absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-sm rounded py-1 px-2 whitespace-nowrap z-50',
          positionClasses[position],
          className
        )}
      >
        {content}
        <div
          className={cn(
            'absolute w-2 h-2 bg-gray-800 transform rotate-45',
            position === 'top' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1',
            position === 'bottom' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-1',
            position === 'left' && 'right-0 top-1/2 translate-x-1 -translate-y-1/2',
            position === 'right' && 'left-0 top-1/2 -translate-x-1 -translate-y-1/2'
          )}
        />
      </div>
    </div>
  );
};

export default Tooltip;
