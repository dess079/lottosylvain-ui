import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../shadcn';

interface ErrorBoundaryUIProps {
  error: any;
  stack?: string;
}

/**
 * Composant UI pour afficher les erreurs capturées par ErrorBoundary.
 */
export function ErrorBoundaryUI({ error, stack }: ErrorBoundaryUIProps): ReactNode {
  const [previousPath, setPreviousPath] = useState<string>('/');

  useEffect(() => {
    const prev = localStorage.getItem('previousPath') || '/';
    setPreviousPath(prev);
    localStorage.setItem('previousPath', location.pathname);
  }, []);

  return ( 
    <div className="flex flex-col items-center justify-center p-4 m-0 z-50 h-screen bg-fixed bg-gradient-to-br from-muted to-background">
      <div className="max-w-6xl w-full h-full rounded-2xl shadow-2xl md:p-12 lg:p-16 px-6 md:px-12 lg:px-24 border border-border bg-card backdrop-blur-md mx-4 md:mx-8 lg:mx-12 overflow-y-auto">
        <div className="flex flex-col items-center gap-4 mb-8">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-destructive drop-shadow-lg"><path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <h1 className="text-4xl font-extrabold tracking-tight text-destructive mb-2 drop-shadow-lg">Erreur Critique</h1>
          <span className="text-lg font-semibold text-muted-foreground mb-2">L'application a rencontré un problème inattendu</span>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-foreground">Message d'erreur :</p>
          <pre className="bg-muted p-3 rounded text-foreground whitespace-pre-wrap break-words">{error?.toString()}</pre>
        </div>
        {stack && (
          <div className="mb-4">
            <p className="text-lg font-semibold text-foreground">Stack trace :</p>
            <pre className="text-xs bg-muted p-3 rounded text-muted-foreground overflow-x-auto whitespace-pre-wrap break-words">{stack}</pre>
          </div>
        )}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2 text-foreground">Conseils pour le debug :</h3>
          <ul className="text-xs list-disc ml-6 text-muted-foreground">
            <li>Vérifiez la console du navigateur pour plus de détails.</li>
            <li>Assurez-vous que toutes les dépendances sont à jour et compatibles.</li>
            <li>Consultez le code du composant affiché ci-dessus pour identifier la source.</li>
            <li>Si besoin, contactez le support technique avec le message et le stack trace.</li>
          </ul>
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => window.location.href = previousPath} variant="outline">
            Retour à la page précédente ({previousPath})
          </Button>
        </div>
      </div>
    </div>
  );
}
