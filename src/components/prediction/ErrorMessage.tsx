import React from 'react';
import { Alert, AlertDescription } from '../shadcn';

/**
 * Affiche un message d'erreur professionnel.
 * @param error Message d'erreur à afficher
 */
const ErrorMessage: React.FC<{ error: string | null }> = ({ error }) => {
  if (!error) return null;
  return (
    <div
      className="block items-center  w-full"
      style={{ height: '6in', minHeight: '6in', maxHeight: '6in', margin: '0 auto' }}
    >
      {/* Laisse la gestion du fond à shadcn/ui et Tailwind */}
      <Alert variant="destructive" className="w-full max-w-lg mx-auto">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorMessage;
