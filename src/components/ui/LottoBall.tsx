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
  /** Additional Tailwind CSS classes */
  className?: string;
}

/**
 * Renders a lottery ball with the given number.
 *
 * @param number - The lottery number to display.
 * @param isBonus - Highlights the ball if it's the bonus number.
 * @param className - Additional Tailwind CSS classes.
 */
const LottoBall = ({
  number,
  isBonus = false,
  className = ''
}: LottoBallProps): ReactElement => {
  const ballClass = cn(
    // Base styles: responsive size, circular, flex-center, font, base shadow, and smooth transitions
    'w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center font-bold text-lg md:text-xl shadow-lg transition-all duration-300',
    // Subtle border for a 3D effect
    'border-2 border-white/20',
    // Conditional styling for a standard ball with enhanced hover effects
    !isBonus &&
      'bg-gradient-to-br from-primary-400 to-primary-600 text-white hover:shadow-xl hover:scale-105 hover:brightness-110',
    // Conditional styling for a bonus ball with a glowing ring and pulse animation
    isBonus &&
      'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white ring-4 ring-yellow-300/50 animate-pulse',
    // Additional user-provided classes
    className
  );

  return (
    <div
      role="status"
      aria-label={`Lotto number ${number}${isBonus ? ' (bonus)' : ''}`}
      data-testid="lotto-ball"
      className={ballClass}
    >
      {number}
    </div>
  );
};

// Enhance performance with memoization
export default memo(LottoBall);
