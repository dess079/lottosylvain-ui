// Utilitaire local pour formater les dates en YYYY-MM-DD
const isoDate = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');
import React, { useEffect } from 'react';
import { AiPredictionFilters } from '../types/aiPrediction';
import { fetchModels } from '../services/aiPredictionsApi';
import { Button, Badge } from '../../../components/shadcn';
import CalendarDateInput from '../../../components/CalendarDateInput';
import dayjs from 'dayjs';
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
    <div className="space-y-4 px-4 sm:px-6 w-full">
      {/* Section des dates */}
      <div className="space-y-3 w-full">
        <h3 className="text-sm font-semibold text-foreground">Plages de dates</h3>
        
        {/* Dates de prédiction */}
        <div className="space-y-2 w-full">
          <span className="text-xs font-medium text-muted-foreground">Dates de prédictions</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
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

        {/* Dates de tirage */}
        <div className="space-y-2 w-full">
          <span className="text-xs font-medium text-muted-foreground">Dates de tirages</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
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

        {/* Presets rapides */}
        <div className="space-y-2 w-full">
          <span className="text-xs font-medium text-muted-foreground">Raccourcis</span>
          <div className="grid grid-cols-2 gap-1 w-full">
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('mois')} 
              className="text-xs h-8 w-full transition-all duration-200 hover:shadow-lg hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:translate-y-0 focus:ring-2 focus:ring-primary/30"
            >
              Ce mois
            </Button>
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('30j')} 
              className="text-xs h-8 w-full transition-all duration-200 hover:shadow-lg hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:translate-y-0 focus:ring-2 focus:ring-primary/30"
            >
              30 jours
            </Button>
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('7j')} 
              className="text-xs h-8 w-full transition-all duration-200 hover:shadow-lg hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:translate-y-0 focus:ring-2 focus:ring-primary/30"
            >
              7 jours
            </Button>
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('tout')} 
              className="text-xs h-8 w-full transition-all duration-200 hover:shadow-lg hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:translate-y-0 focus:ring-2 focus:ring-primary/30"
            >
              Tout
            </Button>
          </div>
        </div>
      </div>

      {/* Section des modèles */}
      <div className="space-y-3 w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-sm font-semibold text-foreground flex-1">
            Modèles ({filtersSignal.value.models.length})
          </h3>
          {filtersSignal.value.selectedModels.length > 0 && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-xs h-6 px-2 flex-shrink-0 transition-all duration-200 hover:bg-destructive/20 hover:text-destructive hover:-translate-y-0.5 active:translate-y-0 focus:ring-2 focus:ring-destructive/30"
              onClick={() => filtersSignal.value = { ...filtersSignal.value, selectedModels: [] }}
            >
              Vider
            </Button>
          )}
        </div>
        
        <div className="space-y-3 w-full">
          {filtersSignal.value.selectedModels.length > 0 && (
            <div className="text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded border border-primary/20">
              ✓ {filtersSignal.value.selectedModels.length} modèle(s) sélectionné(s)
            </div>
          )}
          
          <div className="border border-border/50 rounded-lg p-3 bg-card/30 backdrop-blur-sm">
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent w-full">
              {filtersSignal.value.models.map(m => {
                const active = filtersSignal.value.selectedModels.includes(m);
                return (
                  <Badge
                    key={m}
                    onClick={() => toggleModel(m)}
                    variant={active ? 'default' : 'secondary'}
                    className={`cursor-pointer select-none transition-all duration-200 text-xs px-3 py-1.5 break-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:ring-2 focus:ring-primary/30 font-medium ${
                      active 
                        ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90' 
                        : 'bg-muted/80 text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                    }`}
                    style={{
                      borderWidth: '2px',
                      borderStyle: 'solid'
                    }}
                  >
                    <span className="flex items-center gap-1">
                      {active && <span className="text-xs">✓</span>}
                      {m}
                    </span>
                  </Badge>
                );
              })}
              {!filtersSignal.value.models.length && !filtersSignal.value.error && (
                <div className="w-full text-center py-4">
                  <div className="animate-pulse flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <span className="text-xs text-muted-foreground italic">Chargement des modèles...</span>
                  </div>
                </div>
              )}
              {filtersSignal.value.models.length === 0 && filtersSignal.value.error && (
                <div className="w-full text-center py-4 text-destructive text-xs">
                  ⚠️ Erreur lors du chargement des modèles
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages d'erreur - plus compact */}
      {filtersSignal.value.validationMsg && (
        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive font-medium w-full break-words">
          {filtersSignal.value.validationMsg}
        </div>
      )}
      
      {filtersSignal.value.error && (
        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive font-medium w-full break-words">
          {filtersSignal.value.error}
        </div>
      )}

      {/* Bouton d'application */}
      <div className="pt-2 border-t w-full">
        <Button 
          onClick={apply} 
          disabled={!!filtersSignal.value.validationMsg}
          className="w-full h-9 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:ring-2 focus:ring-primary/30 disabled:hover:shadow-none disabled:hover:-translate-y-0"
          size="sm"
        >
          <span className="flex items-center gap-2">
            Appliquer les filtres
            <span className="text-xs opacity-70">✓</span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PredictionsFilters;
