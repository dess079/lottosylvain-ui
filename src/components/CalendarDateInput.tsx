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
  /** Active le mode compact (petites cases + moins de padding) */
  compact?: boolean;
}

/**
 * Champ de saisie de date avec icône calendrier, compatible dark mode.
 * @param id Identifiant du champ
 * @param label Label affiché au-dessus
 * @param value Valeur de la date (YYYY-MM-DD)
 * @param onChange Callback lors du changement
 * @param ariaLabel Label d'accessibilité
 */
const CalendarDateInput: React.FC<CalendarDateInputProps> = ({ id, label, value, onChange, ariaLabel, compact = false }) => (
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
  <div className={"flex flex-col items-center w-full sm:w-auto " + (compact ? 'calendar-density-compact' : '')}>
        <label htmlFor={id} className="mb-1 text-center font-medium tracking-wide">
          {label}
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex justify-between items-center bg-background text-foreground border-input hover:bg-accent/10 focus:ring-2 focus:ring-ring/50 focus:ring-offset-1 focus:ring-offset-background"
            >
              <span className="font-mono tracking-tight text-sm text-foreground">
                {value ? value : 'Sélectionner une date'}
              </span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-2 text-muted-foreground">
                <rect x="3" y="5" width="18" height="16" rx="2" strokeWidth="2"/>
                <path strokeWidth="2" d="M16 3v4M8 3v4M3 9h18"/>
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={"p-0 w-auto bg-popover text-popover-foreground border shadow-lg " + (compact ? 'calendar-density-compact' : '')}
            align="start"
            style={{ zIndex: 9999, position: 'relative', opacity: 1 }}
          >
            <Calendar
              value={parseDate(value)}
              onChange={(value) => handleCalendarChange(Array.isArray(value) ? value[0] ?? null : value as Date | null)}
              aria-label={ariaLabel}
              className={"rounded border border-transparent bg-background text-foreground " + (compact ? 'calendar-compact' : '')}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  })()
);

export default CalendarDateInput;
