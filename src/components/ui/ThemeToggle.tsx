import React, { useEffect, useState } from 'react';

/**
 * Composant de bascule du thème clair/sombre avec design tendance 2025
 */
const ThemeToggle: React.FC = () => {
  // Détecte la préférence de l'utilisateur ou utilise le thème clair par défaut
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Vérifier si le document est disponible (côté client)
    if (typeof window !== 'undefined') {
      // Vérifier si un thème a déjà été stocké dans localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Sinon, vérifier les préférences du système
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Appliquer le thème au chargement et lors des changements
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Basculer entre les modes clair et sombre
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}
      title={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}
    >
      {darkMode ? (
        // Icône de soleil pour le mode sombre
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      ) : (
        // Icône de lune pour le mode clair
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
