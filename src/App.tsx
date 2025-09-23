import React, { Component, ReactNode } from 'react';
import { FooterSection } from './components/FooterSection';
import { FuturisticToolbar } from './components/shadcn';
import { TabsLotto } from './components/tabs/ui';
import { ErrorBoundaryUI } from './components/errorBundaries/ErrorBoundaryUI';

/**
 * ErrorBoundary pour capturer les erreurs de rendu des composants enfants.
 */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log professionnel
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryUI error={this.state.error} stack={this.state.error?.stack} />;
    }
    return this.props.children;
  }
}

/**
 * Page principale avec système d'onglets intégré
 * Le composant TabsLotto gère toute la logique des onglets et du chargement paresseux
 * Utilise un hook personnalisé pour calculer dynamiquement la hauteur de la toolbar
 */
const App: React.FC = () => {

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Barre d'outils futuriste avec ref pour mesurer sa hauteur */}
        <FuturisticToolbar />
        {/* TabsLotto occupe tout l'espace disponible entre la toolbar et le footer */}
        <div className="flex-1 flex flex-col">
          <TabsLotto />
        </div>
        <FooterSection />
      </div>
    </ErrorBoundary>
  );
};

export default App;
