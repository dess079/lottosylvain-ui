import { useLayoutEffect, useRef, useState } from 'react';

/**
 * useLockedWidth
 * Capture et fige la largeur initiale d'un élément pour empêcher les micro-shifts
 * (ex: apparition de scrollbar verticale qui réduit la zone de contenu).
 */
export const useLockedWidth = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [lockedWidth, setLockedWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (ref.current && lockedWidth == null) {
      const rect = ref.current.getBoundingClientRect();
      setLockedWidth(rect.width);
    }
  }, [lockedWidth]);

  return {
    ref,
    style: lockedWidth ? { width: `${lockedWidth}px` } : undefined,
  } as const;
};

export default useLockedWidth;
