import React, { useState } from 'react';
import { LottoTemporalGraphData, TemporalGraphResponse } from '../types/lottoTemporalGraph';
import FrequencyOverTimeGraph from './FrequencyOverTimeGraph';
import NumberFrequencyGraph from './NumberFrequencyGraph';
import { useTheme } from '../context/ThemeContext';
import './LottoTemporalGraphScreen.css';

/**
 * Écran de visualisation du graphique temporel Lotto
 * Permet de saisir une date de début et de fin, puis d'afficher le graphique temporel
 */
const LottoTemporalGraphScreen: React.FC = () => {
  const { theme } = useTheme();
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<LottoTemporalGraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère les données du backend selon la période sélectionnée
   */
  const fetchGraphData = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      // Validate date format
      if (!/\d{4}-\d{2}-\d{2}/.test(startDate) || !/\d{4}-\d{2}-\d{2}/.test(endDate)) {
        console.error('Invalid date format:', { startDate, endDate });
        setError('Invalid date format. Please use YYYY-MM-DD.');
        setLoading(false);
        return;
      }

      console.log('Fetching data for date range:', { startDate, endDate });

      const response = await fetch(
        `/api/essais/lotto-matrix/temporal-graph?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des données');
      const json: TemporalGraphResponse = await response.json();
      console.log('Données récupérées:', json);

      if (json && json.graphData) {
        console.debug('GraphData structure:', json.graphData);
        setData({ ...json.graphData }); // Ensure state is updated with a new object reference
      } else {
        console.error('Format de données inattendu:', json);
        setError('Format de données inattendu.');
      }
    } catch (e: any) {
      console.error('Erreur lors de la récupération des données:', e);
      setError(e.message || 'Erreur inconnue');
    } finally {
      console.log('Loading state:', loading);
      console.log('Data state:', data);
      setLoading(false);
    }
  };

  /**
   * Prépare les données pour le graphique de fréquence
   */
  const getFrequencyChartData = () => {
    if (!data || !Array.isArray(data.timelineData) || data.timelineData.length === 0) {
      console.warn('Aucune donnée disponible pour le graphique:', data);
      return { labels: [], datasets: [] };
    }

    const labels = data.timelineData.map((d) => d.date);
    const frequencies = data.timelineData.map((d) => d.frequency);

    return {
      labels,
      datasets: [
        {
          label: 'Frequency of Numbers Over Time',
          data: frequencies,
          borderColor: theme === 'dark' ? '#64b5f6' : '#1976d2',
          backgroundColor: theme === 'dark' ? 'rgba(100, 181, 246, 0.5)' : 'rgba(25, 118, 210, 0.5)',
        },
      ],
    };
  };

  /**
   * Prépare les données pour le graphique de fréquence des numéros de 1 à 49
   */
  const getNumberFrequencyChartData = () => {
    if (!data || !Array.isArray(data.timelineData) || data.timelineData.length === 0) {
      console.warn('Aucune donnée disponible pour le graphique:', data);
      return { labels: [], datasets: [] };
    }

    // Regrouper les fréquences par numéro (1 à 49)
    const numberFrequencies = Array(49).fill(0);
    data.timelineData.forEach((d) => {
      if (d.number >= 1 && d.number <= 49) {
        numberFrequencies[d.number - 1] += d.frequency;
      }
    });

    const labels = Array.from({ length: 49 }, (_, i) => (i + 1).toString());

    return {
      labels,
      datasets: [
        {
          label: 'Frequency of Numbers (1 to 49)',
          data: numberFrequencies,
          borderColor: theme === 'dark' ? '#64b5f6' : '#1976d2',
          backgroundColor: theme === 'dark' ? 'rgba(100, 181, 246, 0.5)' : 'rgba(25, 118, 210, 0.5)',
        },
      ],
    };
  };

  return (
    <div className="flex flex-col lotto-temporal-graph-screen bg-background">
      <div className="flex flex-col items-center mb-8">
        <h2 className="title">Graphique temporel Lotto 6/49</h2>
        <form
          className="date-form"
          onSubmit={(e) => {
            e.preventDefault();
            fetchGraphData();
          }}
        >
          <label>
            Date de début :
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label>
            Date de fin :
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Chargement...' : 'Afficher'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}
      </div>

      {/* Conteneur pour les deux graphiques côte à côte avec gap de 2rem */}
      <div className="flex flex-row w-full gap-8">
        {/* Graphique de fréquence dans le temps - 50% de largeur */}
        <div className="flex-1 w-1/2">
          {data && Array.isArray(data.timelineData) ? (
            <FrequencyOverTimeGraph
              data={getFrequencyChartData()}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          ) : data ? (
            <div className="error">Format de données inattendu. Impossible d'afficher le graphique.</div>
          ) : null}
        </div>

        {/* Graphique de fréquence des numéros - 50% de largeur */}
        <div className="flex-1 w-1/2">
          {data && Array.isArray(data.timelineData) ? (
            <NumberFrequencyGraph
              data={getNumberFrequencyChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Numbers (1 to 49)',
                    },
                    ticks: {
                      stepSize: 1,
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Frequency',
                    },
                  },
                },
              }}
             
            />
          ) : data ? (
            <div className="error">Format de données inattendu. Impossible d'afficher le graphique.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LottoTemporalGraphScreen;
