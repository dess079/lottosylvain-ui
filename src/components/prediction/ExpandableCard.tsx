import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ExpandableCardProps {
  title: string;
  children: React.ReactNode;
  colorClass?: string;
  open?: boolean;
  onToggle?: () => void;
  className?: string;
  defaultOpen?: boolean;
}

/**
 * ExpandableCard
 * Composant réutilisable pour sections expansibles avec gestion uniforme des marges & padding.
 */
const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  children,
  colorClass = '',
  open,
  onToggle,
  className = '',
  defaultOpen = false,
}) => {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const effectiveOpen = isControlled ? open! : internalOpen;

  const toggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen(o => !o);
      onToggle?.();
    }
  };

  return (
    <div className={`mt-3 rounded-lg border-2 border-border bg-card text-card-foreground shadow-md ${className}`}>
      {/* Header (toujours même padding horizontal que contenu) */}
      <button
        type="button"
        onClick={toggle}
        className={`w-full flex items-center gap-2 text-sm font-semibold py-3 px-5 text-left select-none transition-colors hover:bg-muted/40 ${colorClass}`}
      >
        {effectiveOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span className="truncate">{title}</span>
      </button>
      <AnimatePresence initial={false}>
        {effectiveOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-1">{/* Même padding horizontal que le header */}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableCard;
