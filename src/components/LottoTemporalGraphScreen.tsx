import { OrbitControls, PointMaterial, Points } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useState } from 'react';
import { LottoTemporalGraphData, TemporalGraphResponse } from '../types/lottoTemporalGraph';
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
        console.debug('GraphData structure:', json.graphData);
        setData(json.graphData);
      } else {
        console.error('Format de données inattendu:', json);
        setError('Format de données inattendu.');
      }
    } catch (e: any) {
      console.error('Erreur lors de la récupération des données:', e);
      setError(e.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Prépare les données pour le nuage de points 3D avec des coordonnées normalisées
   */
  const get3DChartData = (): { x: number; y: number; z: number; size: number }[] => {
    if (!data || !Array.isArray(data.timelineData) || data.timelineData.length === 0) {
      console.warn('Aucune donnée disponible pour le graphique:', data);
      return [];
    }

    console.debug('TimelineData for 3D chart:', data.timelineData);

    return data.timelineData
      .map((d) => ({
        x: d.x,
        y: d.y,
        z: d.size_score, // Utilisation de size_score comme z pour la taille
        size: d.size_score
      }));
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

      {/* Affichage du nuage de points 3D si données valides */}
      {data && Array.isArray(data.timelineData) ? (
        <Canvas style={{ height: '500px', width: '100%' }} camera={{ position: [50, 50, 100], fov: 50 }}>
          <OrbitControls enableZoom={true} maxDistance={200} minDistance={5} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Points>
            <PointMaterial size={0.5} color="#1976d2" />
            {get3DChartData().map((point, index) => (
              <mesh key={index} position={[point.x, point.y, point.z]}>
                <sphereGeometry args={[point.size, 16, 16]} />
                <meshStandardMaterial color="#1976d2" />
              </mesh>
            ))}
          </Points>
        </Canvas>
      ) : data ? (
        <div className="error">Format de données inattendu. Impossible d'afficher le graphique.</div>
      ) : null}
    </div>
  );
};

export default LottoTemporalGraphScreen;
