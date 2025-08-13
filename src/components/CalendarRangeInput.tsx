import React from 'react';
import { Calendar } from './shadcn/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from './shadcn/ui/popover';
import { Button } from './shadcn/ui/button';

interface CalendarRangeInputProps {
  id: string;
  label: string;
  startValue: string;
  endValue: string;
  onChange: (range: { start: string; end: string }) => void;
  ariaLabel: string;
  compact?: boolean;
}

/**
 * Sélecteur de plage de dates (start/end) basé sur react-calendar (mode range).
 * Fournit un bouton unique ouvrant un calendrier permettant de choisir deux dates.
 */
const CalendarRangeInput: React.FC<CalendarRangeInputProps> = ({
  id,
  label,
  startValue,
  endValue,
  onChange,
  ariaLabel,
  compact = false
}) => {
  const [open, setOpen] = React.useState(false);
  const [internalRange, setInternalRange] = React.useState<[Date | null, Date | null]>([
    parseDate(startValue),
    parseDate(endValue)
  ]);

  function parseDate(str: string): Date | null {
    if (!str) return null;
    const parts = str.split('-');
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }

  function formatDate(date: Date | null): string {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const applyRange = (range: [Date | null, Date | null]) => {
    setInternalRange(range);
    if (range[0] && range[1]) {
      onChange({ start: formatDate(range[0]), end: formatDate(range[1]) });
      setOpen(false);
    }
  };

  const handleCalendarChange = (value: any) => {
    // react-calendar range returns Date[]
    if (Array.isArray(value)) {
      const first = value[0] ?? null;
      const second = value[1] ?? null;
      applyRange([first, second]);
    }
  };

  const display = startValue && endValue ? `${startValue} → ${endValue}` : 'Sélectionner plage';

  return (
    <div className={`flex flex-col items-center w-full sm:w-auto ${compact ? 'calendar-density-compact' : ''}`}>
      <label htmlFor={id} className="mb-1 text-center tracking-wide">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex justify-between items-center bg-background text-foreground  hover:bg-accent/10"
          >
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`p-0 w-auto bg-popover text-popover-foreground  shadow-lg ${compact ? 'calendar-density-compact' : ''}`}
          align="start"
          style={{ zIndex: 9999, position: 'relative', opacity: 1 }}
        >
          <Calendar
            selectRange
            value={internalRange as any}
            onChange={handleCalendarChange as any}
            aria-label={ariaLabel}
            className={`rounded text-foreground ${compact ? 'calendar-compact' : ''}`}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CalendarRangeInput;
