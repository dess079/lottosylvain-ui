import { useEffect, useState } from 'react';
import { AiPredictionDetail } from '../types/aiPrediction';
import { fetchPrediction } from '../services/aiPredictionsApi';

export function useAiPredictionDetail(id: number | null) {
  const [data, setData] = useState<AiPredictionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id == null) return;
    setLoading(true);
    setError(null);
    fetchPrediction(id)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}
