import { useEffect, useState, useRef } from 'react';
import { AiPredictionFilters, AiPredictionPageResponse } from '../types/aiPrediction';
import { fetchPredictions } from '../services/aiPredictionsApi';

// Cache mémoire clé = JSON(filters)
export const aiPredictionsCache = new Map<string, AiPredictionPageResponse>();
export function invalidateAiPredictionsCache() { aiPredictionsCache.clear(); }

export function useAiPredictions(filters: AiPredictionFilters) {
  const [data, setData] = useState<AiPredictionPageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const key = JSON.stringify(filters);
    if (aiPredictionsCache.has(key)) {
      setData(aiPredictionsCache.get(key)!);
      return;
    }
    setLoading(true);
    setError(null);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchPredictions(filters)
        .then(resp => {
          aiPredictionsCache.set(key, resp);
          setData(resp);
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [filters]);

  return { data, loading, error };
}
