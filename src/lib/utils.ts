import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with TailwindCSS classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date as a localized string
 */
export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generates next draw date based on today's date
 * Lotto 6/49 draws are on Wednesdays and Saturdays
 */
export function getNextDrawDate(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  let daysToAdd = 0;
  
  // If today is Sunday (0) or Monday (1), next draw is Wednesday (3)
  if (dayOfWeek === 0) {
    daysToAdd = 3;
  } else if (dayOfWeek === 1) {
    daysToAdd = 2;
  } else if (dayOfWeek === 2) {
    daysToAdd = 1;
  // If today is Wednesday (3), next draw is Saturday (6)
  } else if (dayOfWeek === 3) {
    daysToAdd = 3;
  // If today is Thursday (4) or Friday (5), next draw is Saturday (6)
  } else if (dayOfWeek === 4) {
    daysToAdd = 2;
  } else if (dayOfWeek === 5) {
    daysToAdd = 1;
  // If today is Saturday (6), next draw is Wednesday (3)
  } else if (dayOfWeek === 6) {
    daysToAdd = 4;
  }
  
  const nextDrawDate = new Date(today);
  nextDrawDate.setDate(today.getDate() + daysToAdd);
  return nextDrawDate;
}
