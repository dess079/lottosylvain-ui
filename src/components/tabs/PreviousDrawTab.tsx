import React, { useEffect, useReducer } from 'react';
import { getDay, format as formatDate } from 'date-fns';
import { LottoBall } from '../shadcn';
import { fetchPreviousResults } from '../../services/api';
import type { PreviousResult } from '../../types';
import CalendarDateInput from '../CalendarDateInput';
import './PreviousDrawTab.css';

interface PreviousDrawTabProps {
  isActive: boolean;
  /** Taille globale forcée des boules (xs, sm, md, lg). Si non définie, logique auto. */
  ballSize?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * Vérifie si aujourd'hui est un jour de tirage (mercredi ou samedi)
 */
function isTodayDrawDay(): boolean {
  const today = new Date();
  const day = getDay(today);
  return day === 3 || day === 6; // mercredi ou samedi
}

/**
 * Vérifie si la date du tirage affiché correspond à aujourd'hui
 */
function isDrawFromToday(drawDate: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return drawDate === today;
}

/**
 * Composant pour afficher le dernier tirage officiel
 * Charge les données seulement quand l'onglet est actif
 */
const PreviousDrawTab: React.FC<PreviousDrawTabProps> = ({ isActive, ballSize }) => {
  // Types et reducer (déclaration unique, sans doublons)
  type State = {
    previousDraw: PreviousResult | null;
    drawError: string | null;
    drawLoading: boolean;
    hasLoaded: boolean;
    startDate: string;
  endDate: string;
  // si l'utilisateur a modifié les dates via le formulaire
  datesEditedByUser: boolean;
  };
  type Action =
    | { type: 'SET_PREVIOUS_DRAW'; payload: PreviousResult }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_LOADED'; payload: boolean }
  | { type: 'SET_START_DATE'; payload: string }
  | { type: 'SET_END_DATE'; payload: string }
  | { type: 'SET_DATES_EDITED'; payload: boolean };

  const today = new Date().toISOString().slice(0, 10);
  const initialState: State = {
    previousDraw: null,
    drawError: null,
    drawLoading: false,
    hasLoaded: false,
    startDate: today,
    endDate: today,
  datesEditedByUser: false,
  };

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'SET_PREVIOUS_DRAW':
        return { ...state, previousDraw: action.payload };
      case 'SET_ERROR':
        return { ...state, drawError: action.payload };
      case 'SET_LOADING':
        return { ...state, drawLoading: action.payload };
      case 'SET_LOADED':
        return { ...state, hasLoaded: action.payload };
      case 'SET_START_DATE':
        return { ...state, startDate: action.payload };
      case 'SET_END_DATE':
        return { ...state, endDate: action.payload };
      case 'SET_DATES_EDITED':
        return { ...state, datesEditedByUser: action.payload };
      default:
        return state;
    }
  }

  // Ajout du hook useReducer pour la gestion d'état
  const [state, dispatch] = useReducer(reducer, initialState);

  // Log state for debugging when error or data changes
  React.useEffect(() => {
    if (state.drawError) {
      console.error('[PreviousDrawTab] Erreur affichée:', state.drawError);
    }
    if (state.previousDraw) {
      console.info('[PreviousDrawTab] Données reçues:', state.previousDraw);
    }
  }, [state.drawError, state.previousDraw]);

  useEffect(() => {
    // Charger le dernier tirage disponible (sans spécifier de dates)
    loadPreviousDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    // Charge les données seulement quand l'onglet devient actif
  useEffect(() => {
    if (isActive && !state.hasLoaded) {
      // Charger le dernier tirage disponible (sans spécifier de dates)
      loadPreviousDraw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, state.hasLoaded]);

  /**
   * Met à jour la date de début et de fin après chargement du dernier tirage
   * startDate = date du dernier tirage
   * endDate = prochain mercredi ou samedi suivant cette date
   */
  useEffect(() => {
    // Ne pas écraser les dates si l'utilisateur les a modifiées
    if (
      !state.datesEditedByUser &&
      state.previousDraw &&
      Array.isArray(state.previousDraw.previousResult) &&
      state.previousDraw.previousResult.length > 0 &&
      typeof state.previousDraw.previousResult[0].previousResultDate === 'string'
    ) {
      dispatch({ type: 'SET_START_DATE', payload: state.previousDraw.previousResult[0].previousResultDate });
    }
  }, [state.previousDraw, state.datesEditedByUser]);

  /**
   * Récupère les données du dernier tirage
   * Si aucun paramètre n'est fourni, demande le dernier tirage au backend
   * Sinon, recherche dans la période spécifiée
   */
  const loadPreviousDraw = async (start?: string, end?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      let previousResult: PreviousResult | any;

      // Si aucun paramètre n'est fourni, demander le dernier tirage au backend
      if (start === undefined && end === undefined) {
        previousResult = await fetchPreviousResults();
      } else {
        // Sinon, rechercher dans la période spécifiée
        const today = new Date().toISOString().slice(0, 10);
        const startDate = start ? start.slice(0, 10) : today;
        const endDate = end ? end.slice(0, 10) : today;
        previousResult = await fetchPreviousResults(startDate, endDate);
      }

      console.log('[PreviousDrawTab] loadPreviousDraw', { start, end, previousResult });

      // Gérer le cas où le backend renvoie directement un tableau
      let normalizedResult: PreviousResult;
      if (Array.isArray(previousResult)) {
        // Le backend renvoie directement un tableau
        normalizedResult = { previousResult: previousResult };
      } else if (previousResult && previousResult.previousResult) {
        // Le backend renvoie un objet avec previousResult
        normalizedResult = previousResult;
      } else {
        normalizedResult = { previousResult: [] };
      }

      if (!normalizedResult.previousResult || normalizedResult.previousResult.length === 0) {
        dispatch({ type: 'SET_ERROR', payload: 'Aucun tirage trouvé pour la période sélectionnée.' });
        dispatch({ type: 'SET_PREVIOUS_DRAW', payload: normalizedResult });
      } else {
        dispatch({ type: 'SET_PREVIOUS_DRAW', payload: normalizedResult });
      }
      dispatch({ type: 'SET_LOADED', payload: true });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Erreur lors de la récupération du dernier tirage' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Gère la soumission du formulaire de dates
   */
  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPreviousDraw(state.startDate, state.endDate);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start mb-4">
      <h2 className="text-4xl font-bold text-center gradient-text">Précédent tirage(s)</h2>
      {/* Formulaire de sélection de dates */}
      <div className="w-full flex justify-center mb-8">
        <form
          className="w-full max-w-md flex flex-col sm:flex-row gap-4 items-center justify-center"
          onSubmit={handleDateSubmit}
          aria-label="Sélection de la période des tirages"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
            <CalendarDateInput
              id="start-date"
              label="Date de début"
              value={state.startDate}
              onChange={e => {
                dispatch({ type: 'SET_START_DATE', payload: e.target.value });
                dispatch({ type: 'SET_DATES_EDITED', payload: true });
              }}
              ariaLabel="Date de début"
            />
            <CalendarDateInput
              id="end-date"
              label="Date de fin"
              value={state.endDate}
              onChange={e => {
                dispatch({ type: 'SET_END_DATE', payload: e.target.value });
                dispatch({ type: 'SET_DATES_EDITED', payload: true });
              }}
              ariaLabel="Date de fin"
            />
          </div>
          <button
            type="submit"
            className="self-end px-5 py-2 rounded bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors shadow"
            aria-label="Rechercher les tirages"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Légende unique */}
      <div className="w-full max-w-4xl flex flex-col items-center mb-6 gap-2">
        <div className="flex items-center gap-4 text-xs md:text-sm opacity-80 flex-wrap justify-center">
          <span className="inline-flex items-center gap-1"><span className="w-4 h-4 rounded-full lotto-ball-regular inline-block"></span> Régulier</span>
          <span className="inline-flex items-center gap-1"><span className="w-4 h-4 rounded-full lotto-ball-bonus inline-block"></span> Bonus</span>
        </div>
        <div className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
          Maximum 25 tirages affichés.
        </div>
      </div>

      {/* Contenu centré sous le formulaire */}
      <div className="flex-1 w-full flex flex-col items-center justify-center px-4">
        {/* Loader animé pendant le chargement */}
        {state.drawLoading && (
          <div className="flex flex-col items-center justify-center my-8 w-full">
            <span className="material-symbols-outlined animate-spin text-indigo-500 text-4xl mb-2">autorenew</span>
            <p className="text-center text-base">Chargement du dernier tirage...</p>
          </div>
        )}

        {/* Message d'erreur */}
        {state.drawError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center w-full max-w-xl">
            <span className="text-red-500">{state.drawError}</span>
          </div>
        )}
        
        {/* Résultat ou message si aucun résultat */}
        {!state.drawLoading && state.previousDraw && Array.isArray(state.previousDraw.previousResult) && state.previousDraw.previousResult.length > 0 ? (
          <>
            {state.previousDraw.previousResult.length === 1 ? (
              // Affichage spécial pour un seul tirage : boules très grosses centrées
              <div className="flex flex-col items-center justify-center gap-8 previous-draw-animation animate-fade-in w-full">
                {state.previousDraw.previousResult.slice(0, 1).map((draw, idx) => (
                  <div key={draw.previousResultDate + '-' + idx} className="w-full flex flex-col items-center gap-6">
                    {/* Date du tirage */}
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Tirage du
                      </h3>
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        {formatDate(new Date(draw.previousResultDate), 'yyyy-MM-dd')}
                      </p>
                      {/* Message si le tirage du jour n'est pas encore disponible */}
                      {isTodayDrawDay() && !isDrawFromToday(draw.previousResultDate) && (
                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 italic">
                          ⚠️ Le tirage d'aujourd'hui n'est pas encore disponible
                        </p>
                      )}
                    </div>

                    {/* Les 6 numéros principaux en très grand, prenant toute la largeur */}
                    <div className="flex justify-center gap-8 mb-6 w-full max-w-6xl flex-wrap">
                      {Array.isArray(draw.resultNumbers) && draw.resultNumbers.length > 0 ? (
                        draw.resultNumbers.map((num: number, i: number) => (
                          <LottoBall
                            key={i}
                            number={num}
                            size="xl"
                            type="regular"
                            className="!w-32 !h-32 !text-5xl !leading-[8rem]"
                          />
                        ))
                      ) : (
                        <span className="text-slate-400 text-2xl">Aucun numéro à afficher</span>
                      )}
                    </div>

                    {/* Numéro bonus centré en dessous */}
                    {typeof draw.bonusNumber === 'number' && (
                      <div className="flex flex-col items-center gap-4">
                        <h4 className="text-2xl font-semibold text-slate-600 dark:text-slate-300">
                          Numéro Bonus
                        </h4>
                        <LottoBall
                          number={draw.bonusNumber}
                          size="xl"
                          type="bonus"
                          className="!w-32 !h-32 !text-5xl !leading-[8rem]"
                        />
                      </div>
                    )}

                    {/* Message d'erreur s'il y en a un */}
                    {draw.message && (
                      <div className="text-sm text-red-500 text-center mt-4">
                        {draw.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Affichage normal pour plusieurs tirages : cards
              <div className="flex flex-wrap justify-center gap-4 previous-draw-animation animate-fade-in w-full">
                {state.previousDraw.previousResult.slice(0, 25).map((draw, idx) => (
                <div 
                  key={draw.previousResultDate + '-' + idx} 
                  className="rounded-lg shadow-lg border-2 p-3 min-w-[240px] max-w-[280px] flex-shrink-0"
                >
                  {/* Date du tirage */}
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Tirage du
                    </h3>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {formatDate(new Date(draw.previousResultDate), 'yyyy-MM-dd')}
                    </p>
                  </div>

                  {/* Numéros du tirage */}
                  <div className="flex justify-center gap-1 mb-3">
                    {Array.isArray(draw.resultNumbers) && draw.resultNumbers.length > 0 ? (
                      draw.resultNumbers.map((num: number, i: number) => (
                        <LottoBall
                          key={i}
                          number={num}
                          size={ballSize || 'xs'}
                          type="regular"
                        />
                      ))
                    ) : (
                      <span className="text-slate-400 text-base">Aucun numéro à afficher</span>
                    )}
                    {/* Boule bonus */}
                    {typeof draw.bonusNumber === 'number' && (
                      <LottoBall
                        number={draw.bonusNumber}
                        size={ballSize || 'xs'}
                        type="bonus"
                      />
                    )}
                  </div>

                  {/* Message d'erreur s'il y en a un */}
                  {draw.message && (
                    <div className="text-xs text-red-500 text-center mt-2">
                      {draw.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
            )}
          </>
        ) : (
          !state.drawLoading && !state.drawError && (
            <div className="w-full max-w-xl text-center text-base text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center">
              Aucun résultat trouvé pour la période sélectionnée.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PreviousDrawTab;
