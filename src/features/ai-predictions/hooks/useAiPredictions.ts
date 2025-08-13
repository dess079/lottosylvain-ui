import { useEffect, useState, useRef } from 'react';
import { AiPredictionFilters, AiPredictionPageResponse } from '../types/aiPrediction';
import { fetchPredictions } from '../services/aiPredictionsApi';

// Cache mémoire clé = JSON(filters)
const cache = new Map<string, AiPredictionPageResponse>();

export function useAiPredictions(filters: AiPredictionFilters) {
  const [data, setData] = useState<AiPredictionPageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const key = JSON.stringify(filters);
    if (cache.has(key)) {
      setData(cache.get(key)!);
      return;
    }
    setLoading(true);
    setError(null);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchPredictions(filters)
        .then(resp => {
          cache.set(key, resp);
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
