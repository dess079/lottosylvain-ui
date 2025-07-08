import React, { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered';
}

/**
 * A reusable card component for containing content
 */
const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-card p-6 transition-shadow duration-300 hover:shadow-card-hover',
        variant === 'bordered' && 'border border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
