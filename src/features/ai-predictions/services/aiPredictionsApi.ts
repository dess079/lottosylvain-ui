import { AiPredictionDetail, AiPredictionFilters, AiPredictionPageResponse } from '../types/aiPrediction';

const BASE_URL = '/api/predictions';

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return q ? `?${q}` : '';
}

export async function fetchPredictions(filters: AiPredictionFilters): Promise<AiPredictionPageResponse> {
  const query = buildQuery({
    page: filters.page ?? 0,
    size: filters.size ?? 10,
    sort: filters.sort ?? 'dateHeurePrediction:desc',
    datePredictionFrom: filters.datePredictionFrom,
    datePredictionTo: filters.datePredictionTo,
    dateTirageFrom: filters.dateTirageFrom,
    dateTirageTo: filters.dateTirageTo,
    model: filters.modelCsv,
  });
  const res = await fetch(`${BASE_URL}${query}`);
  if (!res.ok) {
    throw new Error(`Erreur API (${res.status}) lors du chargement des prédictions`);
  }
  return res.json();
}

export async function fetchPrediction(id: number): Promise<AiPredictionDetail> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error(`Erreur API (${res.status}) lors du chargement du détail prédiction`);
  }
  return res.json();
}

export async function fetchModels(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/models`);
  if (!res.ok) {
    throw new Error(`Erreur API (${res.status}) lors du chargement des modèles`);
  }
  return res.json();
}

/**
 * Supprime une prédiction par son identifiant.
 * @param id identifiant prédiction
 */
export async function deletePrediction(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`Erreur API (${res.status}) lors de la suppression de la prédiction`);
  }
}
