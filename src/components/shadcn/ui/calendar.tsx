// Locally define Value type to match react-calendar's possible values
type Value = Date | Date[] | [Date | null, Date | null] | null;
import React from 'react';
import CalendarLib from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { cn } from '../../../lib/utils';

import './Calendar.css';

/**
 * Calendar component using react-calendar for advanced date selection.
 *
 * @param {object} props - All props are passed to react-calendar.
 * @example
 * <Calendar
 *   value={date}
 *   onChange={setDate}
 *   minDate={new Date(2000, 0, 1)}
 *   maxDate={new Date(2030, 11, 31)}
 *   showNavigation={true}
 *   showNeighboringMonth={true}
 * />
 */
/**
 * Ajout d'une prop inputRef pour modifier le champ d'édition lors de la sélection.
 */
function Calendar({ className, inputRef, onChange, ...props }: React.ComponentProps<typeof CalendarLib> & { inputRef?: React.RefObject<HTMLInputElement>, onChange?: (date: Date | null) => void }) {
  /**
   * Handler for react-calendar's onChange event.
   * Converts Value (Date | Date[] | null) to Date | null and calls custom onChange prop.
   * @param value Selected date value from react-calendar
   * @param event Mouse event from calendar selection
   */
  const handleChange = (value: Value, event: React.MouseEvent<any>) => {
    let date: Date | null = null;
    if (Array.isArray(value)) {
      date = value[0] ?? null;
    } else {
      date = value as Date | null;
    }
    if (inputRef && inputRef.current) {
      inputRef.current.value = date ? date.toLocaleDateString() : '';
    }
    if (onChange) {
      onChange(date);
    }
  };
  return (
    <div
      className={cn(
        'rounded-md mx-auto',
        'max-w-xs', // Tailwind: max-width: 20rem (320px)
       
        className
      )}
    >
      <CalendarLib
        {...props}
        onChange={handleChange}
        className={cn(
          'w-full',
       
        )}
      />
    </div>
  );
}
export { Calendar }
