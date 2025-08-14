// Utilitaire local pour formater les dates en YYYY-MM-DD
const isoDate = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');
import React, { useEffect } from 'react';
import { AiPredictionFilters } from '../types/aiPrediction';
import { fetchModels } from '../services/aiPredictionsApi';
import { Button, Badge } from '../../../components/shadcn';
import CalendarDateInput from '../../../components/CalendarDateInput';
import dayjs from 'dayjs';
import { Separator } from '../../../components/shadcn';
import { aiPredictionFiltersSignal } from '../../../signals/predictionSignal';

interface Props {
  // Callback quand l'utilisateur clique sur "Appliquer"
  onApply: (filters: Partial<AiPredictionFilters>) => void;
  // Signal externe pour réinitialiser (incrément à chaque reset)
  resetSignal?: number;
}

// Utilise le signal global importé
const filtersSignal = aiPredictionFiltersSignal;

const PredictionsFilters: React.FC<Props> = ({ onApply, resetSignal }) => {
  // Chargement des modèles
  useEffect(() => {
    fetchModels()
      .then((models) => { filtersSignal.value = { ...filtersSignal.value, models }; })
      .catch(e => { filtersSignal.value = { ...filtersSignal.value, error: e.message }; });
  }, []);

  /**
   * Valide les plages de dates et met à jour le message de validation
   */
  const validate = () => {
    filtersSignal.value = { ...filtersSignal.value, validationMsg: null };
    const {
      datePredictionFrom,
      datePredictionTo,
      dateTirageFrom,
      dateTirageTo,
    } = filtersSignal.value;
    if (datePredictionFrom && datePredictionTo && dayjs(datePredictionFrom).isAfter(dayjs(datePredictionTo))) {
      filtersSignal.value = { ...filtersSignal.value, validationMsg: 'Plage de dates prédiction invalide' };
      return false;
    }
    if (dateTirageFrom && dateTirageTo && dayjs(dateTirageFrom).isAfter(dayjs(dateTirageTo))) {
      filtersSignal.value = { ...filtersSignal.value, validationMsg: 'Plage de dates tirage invalide' };
      return false;
    }
    return true;
  };

  /**
   * Applique les filtres et déclenche le callback parent
   */
  const apply = () => {
    if (!validate()) return;
    const {
      datePredictionFrom,
      datePredictionTo,
      dateTirageFrom,
      dateTirageTo,
      selectedModels,
    } = filtersSignal.value;
    onApply({
      datePredictionFrom: datePredictionFrom ? `${datePredictionFrom}T00:00` : undefined,
      datePredictionTo: datePredictionTo ? `${datePredictionTo}T23:59` : undefined,
      dateTirageFrom: dateTirageFrom || undefined,
      dateTirageTo: dateTirageTo || undefined,
      modelCsv: selectedModels.length ? selectedModels.join(',') : undefined,
    });
  };

  /**
   * Réinitialise tous les filtres à leur valeur par défaut
   */
  useEffect(() => {
    if (resetSignal === undefined) return;
    const now = dayjs();
    const firstDay = now.startOf('month');
    let d = firstDay;
    let fws = firstDay;
    for (let i = 0; i < 14; i++) {
      if ([3, 6].includes(d.day())) { fws = d; break; }
      d = d.add(1, 'day');
    }
    filtersSignal.value = {
      ...filtersSignal.value,
      datePredictionFrom: isoDate(firstDay),
      datePredictionTo: isoDate(now),
      dateTirageFrom: isoDate(fws),
      dateTirageTo: isoDate(now),
      selectedModels: [],
      validationMsg: null,
    };
  }, [resetSignal]);

  /**
   * Ajoute ou retire un modèle de la sélection
   */
  const toggleModel = (m: string) => {
    const { selectedModels } = filtersSignal.value;
    filtersSignal.value = {
      ...filtersSignal.value,
      selectedModels: selectedModels.includes(m)
        ? selectedModels.filter(x => x !== m)
        : [...selectedModels, m],
    };
  };

  /**
   * Applique un preset rapide sur les dates
   */
  const applyPreset = (preset: 'mois' | '30j' | '7j' | 'tout') => {
    const now = dayjs();
    const isoDateFn = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');
    let dpFrom = filtersSignal.value.datePredictionFrom;
    let tirFrom = filtersSignal.value.dateTirageFrom;
    if (preset === 'mois') {
      const firstDay = now.startOf('month');
      dpFrom = isoDateFn(firstDay);
      let d = firstDay;
      for (let i = 0; i < 14; i++) {
        const dow = d.day();
        if (dow === 3 || dow === 6) { tirFrom = isoDateFn(d); break; }
        d = d.add(1, 'day');
      }
    } else if (preset === '30j') {
      const past = now.subtract(30, 'day');
      dpFrom = isoDateFn(past); tirFrom = isoDateFn(past);
    } else if (preset === '7j') {
      const past = now.subtract(7, 'day');
      dpFrom = isoDateFn(past); tirFrom = isoDateFn(past);
    } else if (preset === 'tout') {
      const oneYearAgo = now.subtract(1, 'year');
      dpFrom = isoDateFn(oneYearAgo);
      tirFrom = isoDateFn(oneYearAgo);
    }
    filtersSignal.value = {
      ...filtersSignal.value,
      datePredictionFrom: dpFrom,
      datePredictionTo: isoDateFn(now),
      dateTirageFrom: tirFrom,
      dateTirageTo: isoDateFn(now),
    };
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
              value={filtersSignal.value.datePredictionFrom}
              onChange={(e) => {
                const value = e.target.value;
                if (dayjs(value, 'YYYY-MM-DD', true).isValid()) {
                  filtersSignal.value = { ...filtersSignal.value, datePredictionFrom: value };
                }
              }}
              ariaLabel="Date de prédiction - début"
              compact
            />
            <CalendarDateInput
              id="pred-to"
              label="Au"
              value={filtersSignal.value.datePredictionTo}
              onChange={(e) => {
                const value = e.target.value;
                if (dayjs(value, 'YYYY-MM-DD', true).isValid()) {
                  filtersSignal.value = { ...filtersSignal.value, datePredictionTo: value };
                }
              }}
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
              value={filtersSignal.value.dateTirageFrom}
              onChange={(e) => {
                const value = e.target.value;
                if (dayjs(value, 'YYYY-MM-DD', true).isValid()) {
                  filtersSignal.value = { ...filtersSignal.value, dateTirageFrom: value };
                }
              }}
              ariaLabel="Date de tirage - début"
              compact
            />
            <CalendarDateInput
              id="tirage-to"
              label="Au"
              value={filtersSignal.value.dateTirageTo}
              onChange={(e) => {
                const value = e.target.value;
                if (dayjs(value, 'YYYY-MM-DD', true).isValid()) {
                  filtersSignal.value = { ...filtersSignal.value, dateTirageTo: value };
                }
              }}
              ariaLabel="Date de tirage - fin"
              compact
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium tracking-wide">Modèles ({filtersSignal.value.models.length})</span>
          {filtersSignal.value.selectedModels.length > 0 && (
            <Button size="sm" variant="ghost" onClick={() => filtersSignal.value = { ...filtersSignal.value, selectedModels: [] }}>Vider</Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {filtersSignal.value.models.map(m => {
            const active = filtersSignal.value.selectedModels.includes(m);
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
          {!filtersSignal.value.models.length && !filtersSignal.value.error && (
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
      {filtersSignal.value.validationMsg && <p className="text-[11px] text-destructive font-medium">{filtersSignal.value.validationMsg}</p>}
      <div className="flex justify-end">
        <Button size="sm" onClick={apply} disabled={!!filtersSignal.value.validationMsg}>Appliquer</Button>
      </div>
      {filtersSignal.value.error && <p className="text-destructive text-xs font-medium text-red-600">{filtersSignal.value.error}</p>}
      <Separator />
    </div>
  );
};

export default PredictionsFilters;
