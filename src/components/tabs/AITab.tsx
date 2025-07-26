import React, { useEffect, useState } from 'react';
import { fetchAIPrediction } from '../../services/api';
import './AITab.css';

/**
 * Onglet affichant les informations retournées par l'IA Lotto649
 * Affiche les numéros prédits et les détails d'analyse
 */
const AITab: React.FC = () => {
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAIPrediction()
      .then((data) => {
        setAiResponse(data);
        setError(null);
      })
      .catch(() => {
        setAiResponse(null);
        setError('Erreur lors de la récupération des données IA');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="ai-tab-empty">Chargement de la prédiction IA...</div>;
  }
  if (error) {
    return <div className="ai-tab-empty">{error}</div>;
  }
  if (!aiResponse) {
    return <div className="ai-tab-empty">Aucune donnée IA disponible.</div>;
  }

  return (
    <div className="ai-tab-container">
      <h2 className="ai-tab-title">Prédiction IA Lotto649</h2>
      <div className="ai-tab-section">
        <strong>Numéros prédits :</strong>
        <div className="ai-tab-numbers">
          {aiResponse.predictedNumbers?.map((num: number) => (
            <span key={num} className="ai-tab-ball">{num}</span>
          ))}
        </div>
      </div>
      {aiResponse.analysisDetails && (
        <div className="ai-tab-section">
          <strong>Détails d'analyse :</strong>
          <pre className="ai-tab-details">{aiResponse.analysisDetails}</pre>
        </div>
      )}
    </div>
  );
};

export default React.memo(AITab);
