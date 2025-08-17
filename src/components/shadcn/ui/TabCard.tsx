import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * Helper to provide consistent tab trigger classes depending on style mode and active state
 */
export const getTriggerClasses = (isActive: boolean, styleMode: 'pills' | 'segmented') => {
  const basePill = 'min-w-[12rem] flex-shrink-0 group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300';
  const pillHover = 'hover:-translate-y-1 hover:shadow-2xl';
  // More refined active style: keep the pill visually raised (translate up + stronger shadow),
  // with subtle gradient + backdrop blur for dark mode, ring and border for relief.
  // Use a static, non-animated background for the active pill to avoid subtle gradual color changes.
  // Replaced the gradient + backdrop-blur with a solid card background which respects the theme variables.
  const pillActive = '-translate-y-1 shadow-2xl ring-1 ring-indigo-400/30 dark:ring-indigo-300/30 bg-card border border-indigo-600/10';
  const pillInactive = ' hover:bg-gray-50 dark:hover:bg-slate-800';

  // Segmented mode now highlights the active item with an encadré (border + subtle bg)
  const segmentedBase = 'min-w-[9rem] flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-md';
  const segmentedActive = 'border border-indigo-300 dark:border-indigo-600 shadow-sm';
  const segmentedInactive = 'hover:text-indigo-600';

  if (styleMode === 'pills') {
    return `${basePill} ${pillHover} ${isActive ? pillActive : pillInactive}`;
  }

  return `${segmentedBase} ${isActive ? segmentedActive : segmentedInactive}`;
};

interface TabCardProps {
  labelKey: string;
}

const TabCard: React.FC<TabCardProps> = ({ labelKey }) => {
  const { lang, t } = useLanguage();
  // labelKey corresponds to a key in t.tabs
  const label = (t.tabs as any)[labelKey]?.[lang] ?? labelKey;

  return (
    <div className="flex flex-col items-start">
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
};

export default TabCard;
