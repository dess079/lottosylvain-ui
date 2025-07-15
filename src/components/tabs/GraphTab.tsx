import React from 'react';
import LottoTemporalGraphScreen from '../LottoTemporalGraphScreen';
import './GraphTab.css';

interface GraphTabProps {
  isActive: boolean;
}

/**
 * Composant pour afficher le graphique temporel
 * Le composant LottoTemporalGraphScreen gère déjà son propre chargement de données
 */
const GraphTab: React.FC<GraphTabProps> = ({ isActive }) => {
  // Ne rendre le graphique que si l'onglet est actif pour éviter les calculs inutiles
  if (!isActive) {
    return (
      <section>
        <h2 className="text-2xl font-semibold mb-6">Graphique temporel Lotto 6/49</h2>
        <div className="text-center text-base opacity-70 flex items-center justify-center min-h-96">
          Cliquez sur cet onglet pour charger le graphique temporel
        </div>
      </section>
    );
  }

  return (
    <section className="graph-tab-animation">
      <h2 className="text-2xl font-semibold mb-6">Graphique temporel Lotto 6/49</h2>
      <LottoTemporalGraphScreen />
    </section>
  );
};

export default GraphTab;
