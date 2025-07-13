import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { LottoTemporalGraphData, TemporalDataPoint, TemporalGraphResponse } from '../types/lottoTemporalGraph';
import './LottoTemporalGraphScreen.css';

/**
 * Écran de visualisation du graphique temporel Lotto
 * Permet de saisir une date de début et de fin, puis d'afficher le graphique temporel
 */
const LottoTemporalGraphScreen: React.FC = () => {
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<LottoTemporalGraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  /**
   * Récupère les données du backend selon la période sélectionnée
   */
  /**
   * Appelle le endpoint REST pour récupérer les données du graphique temporel
   */
  const fetchGraphData = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(
        `/api/essais/lotto-matrix/temporal-graph?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) throw new Error('Erreur lors de la récupération des données');
      const json: TemporalGraphResponse = await response.json();
      console.log('Données récupérées:', json);
      if (json && json.graphData) {
        setData(json.graphData);
      } else {
        setError('Format de données inattendu.');
      }
    } catch (e: any) {
      setError(e.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtre les données pour le numéro sélectionné (ou tous si null)
   */
  /**
   * Retourne les données filtrées pour le graphique, ou [] si données invalides
   */
  /**
   * Retourne les données filtrées pour le graphique, ou [] si données invalides
   */
  const getChartData = (): TemporalDataPoint[] => {
    if (!data || !Array.isArray(data.timelineData)) {
      return [];
    }
    return data.timelineData.filter(
      (d) => selectedNumber == null || d.number === selectedNumber
    );
  };

  return (
    <div className="lotto-temporal-graph-screen">
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

      {/* Affichage du graphique si données valides */}
      {data && Array.isArray(data.timelineData) ? (
        <>
          <div className="number-select">
            <label>
              Numéro :
              <select
                value={selectedNumber ?? ''}
                onChange={(e) =>
                  setSelectedNumber(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Tous</option>
                {[...new Set(data.timelineData.map((d) => d.number))].map((num) => {
                  const n = Number(num);
                  return (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(0, 7)} />
              <YAxis yAxisId="left" label={{ value: 'Fréquence', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Score priorité', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="frequency"
                stroke="#1976d2"
                name="Fréquence"
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="priorityScore"
                stroke="#ff9800"
                name="Score priorité"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : data ? (
        <div className="error">Format de données inattendu. Impossible d'afficher le graphique.</div>
      ) : null}
    </div>
  );
};

export default LottoTemporalGraphScreen;
