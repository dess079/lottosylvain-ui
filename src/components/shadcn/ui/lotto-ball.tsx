import { memo, ReactElement } from 'react';
import { cn } from '../../../lib/utils';

/**
 * Extended prop definitions with JSDoc
 */
interface LottoBallProps {
  /** The number to display inside the ball */
  number: number;
  /** Whether this ball is the bonus number */
  isBonus?: boolean;
  /** Whether to highlight this ball with glow effect */
  isHighlighted?: boolean;
  /** Size of the ball: 'sm', 'md', or 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Additional Tailwind CSS classes */
  className?: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Whether the ball should animate */
  animate?: boolean;
}

/**
 * Renders a lottery ball with the given number.
 * Follows the 2025 UI/UX standards with modern design trends.
 *
 * @param number - The lottery number to display.
 * @param isBonus - Highlights the ball if it's the bonus number.
 * @param isHighlighted - Adds a glow effect to the ball.
 * @param size - The size of the ball: 'sm', 'md', or 'lg'.
 * @param className - Additional CSS classes.
 * @param onClick - Click handler function.
 * @param animate - Whether to apply animation effects.
 */
const LottoBall = memo(({
  number,
  isBonus = false,
  isHighlighted = false,
  size = 'md',
  className = '',
  onClick,
  animate = false,
}: LottoBallProps): ReactElement => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  }[size];
  
  // Determine background color based on ball number ranges
  let bgColorClass = 'bg-white text-gray-800';
  if (number >= 1 && number <= 10) {
    bgColorClass = 'bg-primary-100 text-primary-800';
  } else if (number >= 11 && number <= 20) {
    bgColorClass = 'bg-blue-100 text-blue-800';
  } else if (number >= 21 && number <= 30) {
    bgColorClass = 'bg-teal-100 text-teal-800';
  } else if (number >= 31 && number <= 40) {
    bgColorClass = 'bg-pink-100 text-pink-800';
  } else if (number >= 41 && number <= 49) {
    bgColorClass = 'bg-amber-100 text-amber-800';
  }
  
  // Special styling for bonus ball
  if (isBonus) {
    bgColorClass = 'bg-yellow-300 text-yellow-900';
  }
  
  // Glow effect for highlighted balls
  const glowEffect = isHighlighted
    ? 'shadow-lg shadow-primary-400/50 dark:shadow-primary-300/30 animate-pulse-glow'
    : '';
  
  // Animation classes
  const animationClass = animate ? 'animate-float' : '';
  
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-bold',
        'border border-gray-200 dark:border-gray-700',
        'transition-all duration-300',
        bgColorClass,
        sizeClasses,
        glowEffect,
        animationClass,
        className
      )}
      onClick={onClick}
    >
      {number}
    </div>
  );
});

LottoBall.displayName = 'LottoBall';

export default LottoBall;
