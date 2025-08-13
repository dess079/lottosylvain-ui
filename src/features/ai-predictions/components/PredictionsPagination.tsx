import React from 'react';
import { Button } from '../../../components/shadcn';

interface Props { page: number; size: number; totalPages: number; onChange: (page: number) => void; }

const PredictionsPagination: React.FC<Props> = ({ page, size: _size, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const prev = () => page > 0 && onChange(page - 1);
  const next = () => page < totalPages - 1 && onChange(page + 1);
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-xs sm:text-sm">
      <div className="flex items-center gap-2">
        <Button onClick={prev} disabled={page === 0} size="sm" variant="outline">Précédent</Button>
        <Button onClick={next} disabled={page >= totalPages - 1} size="sm" variant="outline">Suivant</Button>
      </div>
      <span className="text-muted-foreground">Page {page + 1} / {totalPages}</span>
    </div>
  );
};

export default PredictionsPagination;
