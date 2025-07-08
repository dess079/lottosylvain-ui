import { memo, ReactElement } from 'react';
import { cn } from '../../lib/utils';

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
 * @param size - Size variant of the ball.
 * @param className - Additional Tailwind CSS classes.
 * @param onClick - Optional click handler for interactive balls.
 * @param animate - Whether the ball should have animation effects.
 */
const LottoBall = ({
  number,
  isBonus = false,
  isHighlighted = false,
  size = 'md',
  className = '',
  onClick,
  animate = false
}: LottoBallProps): ReactElement => {
  // Base lotto ball class using our UI component class
  const baseClass = 'lotto-ball';
  
  // Type class (regular or bonus)
  const typeClass = isBonus ? 'lotto-ball-bonus' : 'lotto-ball-regular';
  
  // Size classes
  const sizeClass = {
    sm: 'lotto-ball-sm',
    md: '',  // Default size, no class needed
    lg: 'lotto-ball-lg'
  }[size];
  
  // Highlight class
  const highlightClass = isHighlighted ? 'lotto-ball-highlight' : '';
  
  // Animation class
  const animationClass = animate ? 'animate-float' : '';
  
  // Interactive class if onClick is provided
  const interactiveClass = onClick ? 'cursor-pointer' : '';
  
  // Combine all classes
  const ballClass = cn(
    baseClass,
    typeClass,
    sizeClass,
    highlightClass,
    animationClass,
    interactiveClass,
    className
  );

  return (
    <div
      role="status"
      aria-label={`Lotto number ${number}${isBonus ? ' (bonus)' : ''}${isHighlighted ? ' (highlighted)' : ''}`}
      data-testid="lotto-ball"
      className={ballClass}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {number}
    </div>
  );
};

// Enhance performance with memoization
export default memo(LottoBall);
