import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../LoadingSpinner';
import './LineChartTab.css';

interface LineChartTabProps {
  isActive: boolean;
}

/**
 * Fetch temporal graph data from the backend and aggregate by date.
 * Calls GET /api/essais/lotto-matrix/temporal-graph and expects a response
 * shaped like { graphData: { timelineData: [{ date: 'YYYY-MM-DD', frequency: number }, ...] } }
 * Returns an array of { date, drawCount } sorted by date asc.
 */
const fetchLineChartData = async (): Promise<{ date: string; drawCount: number }[]> => {
  try {
    const res = await fetch('/api/essais/lotto-matrix/temporal-graph');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const timeline: any[] = json?.graphData?.timelineData ?? [];

    // The backend timelineData currently contains one entry per number per date
    // (TemporalDataPoint has a `number` and `frequency` field). Summing `frequency`
    // will yield the number of numbers for that date (typically 6 for a Lotto draw).
    // To get the number of draws per date we aggregate unique numbers per date
    // and divide by 6 (assumes 6 numbers per draw). If `number` is missing we
    // fallback to summing frequencies and divide by 6.
    const numberSets = new Map<string, Set<number>>();
    const freqSums = new Map<string, number>();

    timeline.forEach((p) => {
      const rawDate = p?.date ?? p?.draw_date ?? '';
      const dateStr = typeof rawDate === 'string' ? rawDate : String(rawDate);
      if (!dateStr) return;

      // collect distinct numbers per date when available
      const num = typeof p?.number === 'number' ? p.number : undefined;
      if (typeof num === 'number') {
        const set = numberSets.get(dateStr) ?? new Set<number>();
        set.add(num);
        numberSets.set(dateStr, set);
      }

      // always accumulate frequency as a fallback
      const freq = typeof p?.frequency === 'number' ? p.frequency : 1;
      freqSums.set(dateStr, (freqSums.get(dateStr) ?? 0) + freq);
    });

    const results = Array.from(new Set([...numberSets.keys(), ...freqSums.keys()])).map((date) => {
      const uniqueNums = numberSets.get(date);
      if (uniqueNums && uniqueNums.size > 0) {
        // Each draw has 6 unique numbers -> number of draws = uniqueNumbers / 6
        const drawCount = Math.round(uniqueNums.size / 6) || 0;
        return { date, drawCount };
      }

      // fallback: use summed frequencies / 6
      const sum = freqSums.get(date) ?? 0;
      return { date, drawCount: Math.round(sum / 6) || 0 };
    });

    return results.sort((a, b) => a.date.localeCompare(b.date));
  } catch (e) {
    console.error('Error fetching temporal graph data', e);
    throw e;
  }
};

/**
 * Composant pour afficher le graphique linéaire des tirages
 */
const LineChartTab: React.FC<LineChartTabProps> = ({ isActive }) => {
  const [data, setData] = useState<{ date: string; drawCount: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchLineChartData();
        if (!mounted) return;
        setData(fetchedData);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'Erreur lors de la récupération des données');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (isActive) {
      // Fetch data when the tab becomes active
      load();
    }

    return () => {
      mounted = false;
    };
  }, [isActive]);

  if (!isActive) {
    return (
      <section>
        <h2 className="text-2xl font-semibold mb-6">Graphique linéaire des tirages</h2>
        <div className="text-center text-base opacity-70 flex items-center justify-center min-h-96">
          Cliquez sur cet onglet pour charger le graphique linéaire
        </div>
      </section>
    );
  }

  return (
    <section className="line-chart-tab">
      <h2 className="text-2xl font-semibold mb-6">Graphique linéaire des tirages</h2>

      {loading ? (
        <div className="flex items-center justify-center min-h-48">
          <LoadingSpinner text="Chargement des données..." />
        </div>
      ) : error ? (
        <div className="text-center text-base text-red-600">Erreur: {error}</div>
      ) : data.length === 0 ? (
        <div className="text-center text-base opacity-70 flex items-center justify-center min-h-48">
          Aucune donnée disponible pour le graphique
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Nombre de tirages', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="drawCount" stroke="#82ca9d" name="Nombre de tirages" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
};

export default LineChartTab;
