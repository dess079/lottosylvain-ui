import { LottoAIResponse } from '@/types/LottoAIResponse';
import { signal } from '@preact/signals-react';

import dayjs from 'dayjs';

/**
 * Signal global pour les filtres de prédiction IA
 */
const today = dayjs();
const isoDate = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');
const firstDayOfMonth = today.startOf('month');
const findFirstWedOrSat = (start: dayjs.Dayjs) => {
  let d = start;
  for (let i = 0; i < 14; i++) {
    const dow = d.day();
    if (dow === 3 || dow === 6) return d;
    d = d.add(1, 'day');
  }
  return start;
};

export const aiPredictionFiltersSignal = signal({
  datePredictionFrom: isoDate(firstDayOfMonth),
  datePredictionTo: isoDate(today),
  dateTirageFrom: isoDate(findFirstWedOrSat(firstDayOfMonth)),
  dateTirageTo: isoDate(today),
  selectedModels: [] as string[],
  models: [] as string[],
  error: null as string | null,
  validationMsg: null as string | null,
});

/**
 * Type pour l'état global de la prédiction IA (bouton, prédiction, erreur)
 */
export type AiPredictionState = {
  isAILoading: boolean;
  lottoAIResponse: LottoAIResponse | null;
  error: string | null;
};

/**
 * Signal global pour conserver l'état de la prédiction IA principale dans toute l'application.
 */
export const aiPredictionStateSignal = signal<AiPredictionState>({
  isAILoading: false,
  lottoAIResponse: null,
  error: null,
});
