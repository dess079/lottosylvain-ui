import React from 'react';
import { AiPredictionListItem } from '../types/aiPrediction';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../components/shadcn';
import { Button } from '../../../components/shadcn';

interface Props {
  items: AiPredictionListItem[];
  loading: boolean;
  error: string | null;
  onSelect: (id: number) => void;
}

const PredictionsTable: React.FC<Props> = ({ items, loading, error, onSelect }) => {
  return (
    <div className="w-full">
      <Table className="table-fixed">
  <TableHeader className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <TableRow>
            <TableHead className="w-14">ID</TableHead>
            <TableHead className="w-48">Date prédiction</TableHead>
            <TableHead className="w-32">Date tirage</TableHead>
            <TableHead className="min-w-52">Numéros</TableHead>
            <TableHead className="w-40">Modèle</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">Chargement des prédictions...</TableCell>
            </TableRow>
          )}
          {error && !loading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-destructive text-sm">Erreur: {error}</TableCell>
            </TableRow>
          )}
          {!loading && !error && items.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-sm text-muted-foreground italic">Aucune prédiction trouvée avec les filtres courants.</TableCell>
            </TableRow>
          )}
          {!loading && !error && items.map(it => (
            <TableRow key={it.id} className="cursor-pointer" onClick={() => onSelect(it.id)}>
              <TableCell>{it.id}</TableCell>
              <TableCell className="whitespace-nowrap">{new Date(it.dateHeurePrediction).toLocaleString()}</TableCell>
              <TableCell>{it.dateTirageCible}</TableCell>
              <TableCell className="font-mono text-xs">{it.numbers.join('-')}</TableCell>
              <TableCell>
                <span className="inline-flex max-w-[9rem] truncate" title={it.modelName}>{it.modelName}</span>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onSelect(it.id) }}>Détails</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PredictionsTable;
