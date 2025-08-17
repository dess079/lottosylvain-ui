import React, { createContext, useContext, useState } from 'react';

export type Lang = 'fr' | 'en';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

type Translations = {
  tabs: Record<string, { fr: string; en: string }>;
  tabsSubtitle: Record<string, { fr: string; en: string }>;
  toolbar: { style: { fr: string; en: string }; pills: { fr: string; en: string }; segmented: { fr: string; en: string } };
  toolbarButtons: { search: { fr: string; en: string }; notifications: { fr: string; en: string }; settings: { fr: string; en: string }; profile: { fr: string; en: string } };
  toolbarTitle: { fr: string; en: string };
  languages: { fr: { label: string; abbrev: string }; en: { label: string; abbrev: string } };
  theme: { switchToLight: { fr: string; en: string }; switchToDark: { fr: string; en: string } };
};

const translations: Translations = {
  tabs: {
    previous: { fr: 'Dernier tirage', en: 'Last draw' },
    prediction: { fr: 'Prédiction', en: 'Prediction' },
    graph: { fr: 'Temporel', en: 'Time series' },
    section: { fr: 'Prédiction IA', en: 'AI Prediction' },
    line: { fr: 'Linéaire', en: 'Line chart' },
    pie: { fr: 'Secteurs', en: 'Pie chart' },
    scatter: { fr: 'Dispersion', en: 'Scatter' },
    ai: { fr: 'IA Lotto649', en: 'Lotto649 AI' },
    directai: { fr: 'Direct AI', en: 'Direct AI' },
    aipreds: { fr: 'Gestion Prédictions', en: 'AI Predictions' }
  },
  tabsSubtitle: {
    previous: { fr: 'Résultat officiel', en: 'Official result' },
    prediction: { fr: 'Combinaisons complètes', en: 'Full combinations' },
    graph: { fr: 'Fréquence par date', en: 'Frequency by date' },
    section: { fr: 'Générateur IA', en: 'AI generator' },
    line: { fr: 'Courbe', en: 'Curve' },
    pie: { fr: 'Répartition', en: 'Distribution' },
    scatter: { fr: 'Points', en: 'Points' },
    ai: { fr: 'Analyse', en: 'Analysis' },
    directai: { fr: 'Chat & prompts', en: 'Chat & prompts' },
    aipreds: { fr: 'Historique IA', en: 'AI history' }
  },
  toolbar: {
    style: { fr: 'Affichage', en: 'Style' },
    pills: { fr: 'Cartes', en: 'Pills' },
    segmented: { fr: 'Segmenté', en: 'Segmented' }
  },
  toolbarTitle: { fr: 'Lotto 649 - Analyse & Prédictions', en: 'Lotto 649 - Analysis & Predictions' },
  toolbarButtons: {
    search: { fr: 'Rechercher', en: 'Search' },
    notifications: { fr: 'Notifications', en: 'Notifications' },
    settings: { fr: 'Paramètres', en: 'Settings' },
    profile: { fr: 'Profil', en: 'Profile' }
  },
  languages: {
    fr: { label: 'Français', abbrev: 'FR' },
    en: { label: 'English', abbrev: 'EN' }
  },
  theme: {
    switchToLight: { fr: 'Passer en mode clair', en: 'Switch to light mode' },
    switchToDark: { fr: 'Passer en mode sombre', en: 'Switch to dark mode' }
  }
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('fr');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};

export default LanguageProvider;
