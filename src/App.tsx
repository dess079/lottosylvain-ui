import React from 'react';
import { FooterSection } from './components/FooterSection';
import { FuturisticToolbar } from './components/shadcn';
import { TabsLotto } from './components/tabs/ui';

/**
 * Page principale avec système d'onglets intégré
 * Le composant TabsLotto gère toute la logique des onglets et du chargement paresseux
 * Utilise un hook personnalisé pour calculer dynamiquement la hauteur de la toolbar
 */
const App: React.FC = () => {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Barre d'outils futuriste avec ref pour mesurer sa hauteur */}
      <FuturisticToolbar />
      {/* TabsLotto occupe tout l'espace disponible entre la toolbar et le footer */}
      <div className="flex-1 flex flex-col">
        <TabsLotto />
      </div>
      <FooterSection />
    </div>
  );
};

export default App;
