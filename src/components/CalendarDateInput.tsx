import React from 'react';
import { Calendar } from './shadcn/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from './shadcn/ui/popover';
import { Button } from './shadcn/ui/button';

interface CalendarDateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
}

/**
 * Champ de saisie de date avec icône calendrier, compatible dark mode.
 * @param id Identifiant du champ
 * @param label Label affiché au-dessus
 * @param value Valeur de la date (YYYY-MM-DD)
 * @param onChange Callback lors du changement
 * @param ariaLabel Label d'accessibilité
 */
const CalendarDateInput: React.FC<CalendarDateInputProps> = ({ id, label, value, onChange, ariaLabel }) => (
  (() => {
    const [open, setOpen] = React.useState(false);
    // Convert string (YYYY-MM-DD) to Date | null
    const parseDate = (str: string): Date | null => {
      if (!str) return null;
      const [year, month, day] = str.split('-').map(Number);
      if (!year || !month || !day) return null;
      return new Date(year, month - 1, day);
    };
    // Convert Date | null to string (YYYY-MM-DD)
    const formatDate = (date: Date | null): string => {
      if (!date) return '';
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
    /**
     * Handles date selection from Calendar and triggers input change event.
     * @param date Selected date or null
     */
    const handleCalendarChange = (date: Date | null) => {
      const syntheticEvent = {
        target: { value: formatDate(date) }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
      setOpen(false);
    };
    return (
      <div className="flex flex-col items-center w-full sm:w-auto">
        <label htmlFor={id} className="mb-1 text-center">{label}</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between items-center">
              <span>{value ? value : 'Sélectionner une date'}</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-2 text-slate-400 dark:text-slate-300">
                <rect x="3" y="5" width="18" height="16" rx="2" strokeWidth="2"/>
                <path strokeWidth="2" d="M16 3v4M8 3v4M3 9h18"/>
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto bg-white dark:bg-slate-900" align="start" style={{ zIndex: 9999, position: 'relative', opacity: 1 }}>
            <Calendar
              value={parseDate(value)}
              onChange={(value) => handleCalendarChange(Array.isArray(value) ? value[0] ?? null : value as Date | null)}
              aria-label={ariaLabel}
              className="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-md text-slate-900 dark:text-slate-200"
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  })()
);

export default CalendarDateInput;
