import React from 'react';
import { Button } from '../../../components/shadcn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props { page: number; size: number; totalPages: number; onChange: (page: number) => void; }

const PredictionsPagination: React.FC<Props> = ({ page, size: _size, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const prev = () => page > 0 && onChange(page - 1);
  const next = () => page < totalPages - 1 && onChange(page + 1);
  return (
    <div className="flex items-center justify-end gap-4 py-2 text-xs sm:text-sm">
      <div className="flex items-center gap-4">
        <Button onClick={prev} disabled={page === 0} size="icon" variant="outline" aria-label="Page précédente">
          <ChevronLeft size={18} />
        </Button>
        <Button onClick={next} disabled={page >= totalPages - 1} size="icon" variant="outline" aria-label="Page suivante">
          <ChevronRight size={18} />
        </Button>
        <span className="text-muted-foreground">Page {page + 1} / {totalPages}</span>
      </div>
    </div>
  );
};

export default PredictionsPagination;
