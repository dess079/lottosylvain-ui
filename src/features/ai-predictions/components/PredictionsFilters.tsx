import React, { useState, useEffect } from 'react';
import { AiPredictionFilters } from '../types/aiPrediction';
import { fetchModels } from '../services/aiPredictionsApi';
import { Button, Badge } from '../../../components/shadcn';
import CalendarDateInput from '../../../components/CalendarDateInput';
import dayjs from 'dayjs';
import { Separator } from '../../../components/shadcn';

interface Props {
  // Callback quand l'utilisateur clique sur "Appliquer"
  onApply: (filters: Partial<AiPredictionFilters>) => void;
  // Signal externe pour réinitialiser (incrément à chaque reset)
  resetSignal?: number;
}

const PredictionsFilters: React.FC<Props> = ({ onApply, resetSignal }) => {
  // Helpers pour les dates par défaut
  const today = dayjs();
  const isoDate = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');
  const firstDayOfMonth = today.startOf('month');
  // Trouve le premier mercredi (3) ou samedi (6) du mois (priorité mercredi s'il vient avant samedi)
  const firstWedOrSat = (() => {
    let d = firstDayOfMonth;
    for (let i = 0; i < 14; i++) {
      const dow = d.day();
      if (dow === 3 || dow === 6) return d;
      d = d.add(1, 'day');
    }
    return firstDayOfMonth;
  })();

  // Use date-only strings; time will be normalized at apply time via T00:00/T23:59
  const [datePredictionFrom, setDatePredictionFrom] = useState(() => isoDate(firstDayOfMonth));
  const [datePredictionTo, setDatePredictionTo] = useState(() => isoDate(today));
  const [dateTirageFrom, setDateTirageFrom] = useState(() => isoDate(firstWedOrSat));
  const [dateTirageTo, setDateTirageTo] = useState(() => isoDate(today));
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModels().then(setModels).catch(e => setError(e.message));
  }, []);

  // Validation simple
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const validate = () => {
    setValidationMsg(null);
  if (datePredictionFrom && datePredictionTo && dayjs(datePredictionFrom).isAfter(dayjs(datePredictionTo))) {
      setValidationMsg('Plage de dates prédiction invalide');
      return false;
    }
  if (dateTirageFrom && dateTirageTo && dayjs(dateTirageFrom).isAfter(dayjs(dateTirageTo))) {
      setValidationMsg('Plage de dates tirage invalide');
      return false;
    }
    return true;
  };

  // Appliquer filtres explicitement
  const apply = () => {
    if (!validate()) return;
    onApply({
  // Compose ISO LocalDateTime by anchoring times for day bounds
  datePredictionFrom: datePredictionFrom ? `${datePredictionFrom}T00:00` : undefined,
  datePredictionTo: datePredictionTo ? `${datePredictionTo}T23:59` : undefined,
      dateTirageFrom: dateTirageFrom || undefined,
      dateTirageTo: dateTirageTo || undefined,
      modelCsv: selectedModels.length ? selectedModels.join(',') : undefined,
    });
  };

  // Réinitialisation suite signal externe
  useEffect(() => {
    if (resetSignal === undefined) return;
    // recalculer par défaut
  const now = dayjs();
  const firstDay = now.startOf('month');
  let d = firstDay;
  let fws = firstDay;
  for (let i=0;i<14;i++){ if ([3,6].includes(d.day())) { fws = d; break; } d = d.add(1,'day'); }
  setDatePredictionFrom(isoDate(firstDay));
  setDatePredictionTo(isoDate(now));
  setDateTirageFrom(isoDate(fws));
  setDateTirageTo(isoDate(now));
    setSelectedModels([]);
    setValidationMsg(null);
  }, [resetSignal]);

  const toggleModel = (m: string) => {
    setSelectedModels(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  // Presets rapides
  const applyPreset = (preset: 'mois' | '30j' | '7j' | 'tout') => {
    const now = dayjs();
    const isoDateFn = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');
    let dpFrom = datePredictionFrom; let tirFrom = dateTirageFrom;
    if (preset === 'mois') {
      const firstDay = now.startOf('month');
      dpFrom = isoDateFn(firstDay);
      // recalculer premier mercredi/samedi
      let d = firstDay; for (let i=0;i<14;i++){ const dow=d.day(); if (dow===3||dow===6){ tirFrom = isoDateFn(d); break;} d = d.add(1,'day'); }
    } else if (preset === '30j') {
      const past = now.subtract(30, 'day');
      dpFrom = isoDateFn(past); tirFrom = isoDateFn(past);
    } else if (preset === '7j') {
      const past = now.subtract(7, 'day');
      dpFrom = isoDateFn(past); tirFrom = isoDateFn(past);
    } else if (preset === 'tout') {
      dpFrom = ''; tirFrom = '';
    }
    setDatePredictionFrom(dpFrom);
    setDatePredictionTo(isoDateFn(now));
    setDateTirageFrom(tirFrom);
    setDateTirageTo(isoDateFn(now));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide">Dates prédictions</span>
          <div className="flex flex-wrap items-center gap-2">
            <CalendarDateInput
              id="pred-from"
              label="Du"
              value={datePredictionFrom}
              onChange={(e) => setDatePredictionFrom(e.target.value)}
              ariaLabel="Date de prédiction - début"
              compact
            />
            <CalendarDateInput
              id="pred-to"
              label="Au"
              value={datePredictionTo}
              onChange={(e) => setDatePredictionTo(e.target.value)}
              ariaLabel="Date de prédiction - fin"
              compact
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide">Dates tirage</span>
          <div className="flex flex-wrap items-center gap-2">
            <CalendarDateInput
              id="tirage-from"
              label="Du"
              value={dateTirageFrom}
              onChange={(e) => setDateTirageFrom(e.target.value)}
              ariaLabel="Date de tirage - début"
              compact
            />
            <CalendarDateInput
              id="tirage-to"
              label="Au"
              value={dateTirageTo}
              onChange={(e) => setDateTirageTo(e.target.value)}
              ariaLabel="Date de tirage - fin"
              compact
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium tracking-wide">Modèles ({models.length})</span>
          {selectedModels.length > 0 && (
            <Button size="sm" variant="ghost" onClick={() => setSelectedModels([])}>Vider</Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {models.map(m => {
            const active = selectedModels.includes(m);
            return (
              <Badge
                key={m}
                onClick={() => toggleModel(m)}
                variant={active ? 'default' : 'outline'}
                className={`cursor-pointer select-none transition ${active ? 'ring-1 ring-primary/50' : ''}`}
              >
                {m}
              </Badge>
            );
          })}
          {!models.length && !error && (
            <span className="text-xs text-muted-foreground italic">Chargement modèles...</span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="default" onClick={() => applyPreset('mois')}>Ce mois</Button>
        <Button type="button" size="sm" variant="default" onClick={() => applyPreset('30j')}>30 jours</Button>
        <Button type="button" size="sm" variant="default" onClick={() => applyPreset('7j')}>7 jours</Button>
        <Button type="button" size="sm" variant="default" onClick={() => applyPreset('tout')}>Tout</Button>
      </div>
      {validationMsg && <p className="text-[11px] text-destructive font-medium">{validationMsg}</p>}
      <div className="flex justify-end">
        <Button size="sm" onClick={apply} disabled={!!validationMsg}>Appliquer</Button>
      </div>
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <Separator />
    </div>
  );
};

export default PredictionsFilters;
