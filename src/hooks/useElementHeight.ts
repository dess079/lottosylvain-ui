import { useEffect, useRef, useState } from 'react';

/**
 * Hook personnalisé pour mesurer la hauteur d'un élément DOM
 * Se met à jour automatiquement lors des changements de taille
 * @param extraOffset - Espace supplémentaire à ajouter à la hauteur mesurée (en pixels)
 * @param fallbackHeight - Hauteur de fallback si la mesure échoue (en pixels)
 * @returns [ref, height] - Référence à attacher à l'élément et sa hauteur calculée
 */
export const useElementHeight = (
  extraOffset: number = 0, 
  fallbackHeight: number = 120
): [React.RefObject<HTMLDivElement | null>, number] => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(fallbackHeight + extraOffset);

  useEffect(() => {
    const updateHeight = () => {
      if (elementRef.current) {
        const elementHeight = elementRef.current.offsetHeight;
        if (elementHeight > 0) {
          setHeight(elementHeight + extraOffset);
        }
      }
    };

    // Calculer la hauteur initiale avec un petit délai pour s'assurer que le DOM est rendu
    const timeoutId = setTimeout(updateHeight, 50);

    // Recalculer lors du redimensionnement de la fenêtre
    const handleResize = () => {
      // Petit délai pour s'assurer que le DOM est mis à jour
      setTimeout(updateHeight, 100);
    };

    window.addEventListener('resize', handleResize);
    
    // Observer les changements de taille de l'élément
    let resizeObserver: ResizeObserver | null = null;
    
    if (elementRef.current) {
      resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(elementRef.current);
    }
    
    return () => {
      clearTimeout(timeoutId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [extraOffset]);

  return [elementRef, height];
};

export default useElementHeight;
