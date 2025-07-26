import React from 'react';
import { Calendar } from '../shadcn/ui';

interface ShadcnCalendarInputProps {
  id: string;
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  ariaLabel: string;
}

/**
 * Champ de saisie de date avec le composant Calendar de shadcn/ui.
 * @param id Identifiant du champ
 * @param label Label affiché au-dessus
 * @param value Valeur de la date (Date ou undefined)
 * @param onChange Callback lors du changement
 * @param ariaLabel Label d'accessibilité
 */
const ShadcnCalendarInput: React.FC<ShadcnCalendarInputProps> = ({ id, label, value, onChange, ariaLabel }) => (
  <div className="flex flex-col items-center w-full sm:w-auto">
    <label htmlFor={id} className="mb-1 text-center">{label}</label>
    <div className="w-full flex items-center justify-center">
      <Calendar
        id={id}
        selected={value}
        onSelect={onChange}
        aria-label={ariaLabel}
        mode="single"
        className="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-md"
      />
    </div>
  </div>
);

export default ShadcnCalendarInput;
