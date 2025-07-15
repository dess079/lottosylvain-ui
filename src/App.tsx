import React from 'react';
import { FooterSection } from './components/FooterSection';
import { FuturisticToolbar } from './components/shadcn';
import { TabsLotto } from './components/tabs';

/**
 * Page principale avec système d'onglets intégré
 * Le composant TabsLotto gère toute la logique des onglets et du chargement paresseux
 * Utilise un hook personnalisé pour calculer dynamiquement la hauteur de la toolbar
 */
const App: React.FC = () => {

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col gap-8 mt-4">
      {/* Barre d'outils futuriste avec ref pour mesurer sa hauteur */}     
        <FuturisticToolbar />
      {/* TabsLotto avec padding-top dynamique basé sur la hauteur réelle de la toolbar */}
      <main className="flex justify-center top-4 mt-8">
          <TabsLotto />
      </main>
      
      <FooterSection />
    </div>
  );
};

export default App;
