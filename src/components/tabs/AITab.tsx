import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchAIPrediction } from '../../services/api';
import '../../index.css';
import LottoBall from '../shadcn/ui/lotto-ball';

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
    return (
      <div className="flex flex-col items-center justify-center my-8 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 dark:border-blue-300"></div>
        <div className="spinner"></div>
        <div>Chargement de la prédiction IA...</div>
      </div>
    );
  }
  if (error) {
    return <div className="container error-message">{error}</div>;
  }
  if (!aiResponse) {
    return <div className="container info-message">Aucune donnée IA disponible.</div>;
  }

  // Affichage structuré de la réponse IA
  return (
    <div className="container">
      <h2 className="text-2xl font-semibold mb-6 text-center">Prédiction IA Lotto649</h2>
      {/* Row principale : Métadonnées, Prédiction, Paramètres du prompt */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 mb-8">
        {/* Section Métadonnées + bouton relancer */}
        <div className="card flex-1 border border-primary rounded-xl bg-card p-6 min-w-[280px]">
          <h3 className="section-title mb-4">Métadonnées</h3>
          <div className="meta-list mb-4">
          {aiResponse.timestamp && (
            <div><span className="label">Horodatage :</span> <span className="value">{aiResponse.timestamp}</span></div>
          )}
          {aiResponse.drawDate && (
            <div><span className="label">Date du tirage :</span> <span className="value">{aiResponse.drawDate}</span></div>
          )}
          {aiResponse.gameType && (
            <div><span className="label">Type de jeu :</span> <span className="value">{aiResponse.gameType}</span></div>
          )}
          {aiResponse.analysisType && (
            <div><span className="label">Type d'analyse :</span> <span className="value">{aiResponse.analysisType}</span></div>
          )}
          {aiResponse.model && (
            <div><span className="label">Modèle :</span> <span className="value">{aiResponse.model}</span></div>
          )}
          {aiResponse.depth !== undefined && (
            <div><span className="label">Profondeur d'analyse :</span> <span className="value">{aiResponse.depth}</span></div>
          )}
        </div>
          <button
            className="button mt-2"
            onClick={() => {
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
            }}
            disabled={loading}
            type="button"
            aria-label="Rafraîchir la prédiction IA"
          >
            🔄 Refaire l'analyse
          </button>
        </div>

        {/* Section Prédiction */}
        <div className="card flex-1 border border-secondary rounded-xl bg-card p-6 min-w-[280px]">
          <h3 className="section-title mb-4">Prédiction</h3>
          <div className="numbers-list mb-2 flex flex-wrap gap-2 justify-center">
            {aiResponse.predictedNumbers?.map((num: number, idx: number) => (
              <LottoBall
                key={num + '-' + idx}
                number={num}
                size="md"
                type="prediction"
                animated={true}
              />
            ))}
          </div>
        {aiResponse.success !== undefined && (
          <div><span className="label">Succès :</span> <span className="value">{aiResponse.success ? 'Oui' : 'Non'}</span></div>
        )}
        {aiResponse.processingTimeMs !== undefined && (
          <div><span className="label">Temps de traitement :</span> <span className="value">{aiResponse.processingTimeMs} ms</span></div>
        )}
        {aiResponse.executionTime && (
          <div><span className="label">Temps d'exécution :</span> <span className="value">{aiResponse.executionTime}</span></div>
        )}
      </div>

        {/* Section Paramètres du prompt */}
        {(aiResponse.promptTokens !== undefined || aiResponse.completionTokens !== undefined || aiResponse.model) && (
          <div className="card flex-1 border border-accent rounded-xl bg-card p-6 min-w-[280px]">
            <h3 className="section-title mb-4">Paramètres du prompt</h3>
            <div className="meta-list">
            {aiResponse.model && (
              <div><span className="label">Modèle :</span> <span className="value">{aiResponse.model}</span></div>
            )}
            {aiResponse.promptTokens !== undefined && (
              <div><span className="label">Tokens prompt :</span> <span className="value">{aiResponse.promptTokens}</span></div>
            )}
            {aiResponse.completionTokens !== undefined && (
              <div><span className="label">Tokens complétion :</span> <span className="value">{aiResponse.completionTokens}</span></div>
            )}
          </div>
          </div>
        )}
      </div>

      {/* Row : Contenu IA & Données structurées */}
      {(aiResponse.content || aiResponse.response || (aiResponse.data && Object.keys(aiResponse.data).length > 0)) && (
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 mb-8">
          {/* Section Contenu & Réponse brute */}
          {(aiResponse.content || aiResponse.response) && (
            <div className="card flex-1 border border-cyan-400 rounded-xl bg-card p-6 min-w-[280px] overflow-auto text-xs" style={{maxHeight: '340px'}}>
              <h3 className="section-title mb-4 sticky top-0 z-10 bg-card/90 backdrop-blur-sm py-2" style={{marginLeft: '-1.5rem', marginRight: '-1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem'}}>
                Contenu IA
              </h3>
              <div className="flex flex-col gap-2" style={{height: 'calc(100% - 2rem)'}}>
                {aiResponse.content && (
                  <div className="content-block mb-2 break-words whitespace-pre-wrap text-xs">
                    <ReactMarkdown>{aiResponse.content}</ReactMarkdown>
                  </div>
                )}
                {aiResponse.response && (
                  <div className="content-block raw break-words whitespace-pre-wrap text-xs">
                    <ReactMarkdown>{aiResponse.response}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Section Analyse détaillée */}
          {aiResponse.data && Object.keys(aiResponse.data).length > 0 && (
            <div className="card flex-1 border border-pink-400 rounded-xl bg-card p-6 min-w-[280px] overflow-auto text-xs" style={{maxHeight: '340px'}}>
              <h3 className="section-title mb-4">Données structurées</h3>
              <div className="details overflow-auto max-w-full whitespace-pre-wrap break-all text-xs" style={{maxHeight: '290px'}}>
                <ReactMarkdown>{'```json\n' + JSON.stringify(aiResponse.data, null, 2) + '\n```'}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
      {aiResponse.metadata && Object.keys(aiResponse.metadata).length > 0 && (
        <div className="card mb-8 border border-yellow-400 rounded-xl bg-card p-6">
          <h3 className="section-title mb-4">Métadonnées complémentaires</h3>
          <div className="details">
            <ReactMarkdown>{'```json\n' + JSON.stringify(aiResponse.metadata, null, 2) + '\n```'}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Section Erreur */}
      {(aiResponse.error || aiResponse.errorMessage) && (
        <div className="card error mt-4 border-2 border-red-500 rounded-xl bg-red-50 dark:bg-red-900 p-6">
          <h3 className="section-title mb-2 text-red-700 dark:text-red-300">Erreur</h3>
          {aiResponse.error && (
            <div className="ai-tab-error-block">Code : {aiResponse.error}</div>
          )}
          {aiResponse.errorMessage && (
            <div className="ai-tab-error-block">Message : {aiResponse.errorMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AITab;
