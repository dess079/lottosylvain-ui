import React, { createContext, useContext, useState } from 'react';

type StyleMode = 'pills' | 'segmented';

interface TabStyleContextValue {
  styleMode: StyleMode;
  setStyleMode: (m: StyleMode) => void;
}

const TabStyleContext = createContext<TabStyleContextValue | undefined>(undefined);

export const TabStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [styleMode, setStyleMode] = useState<StyleMode>('pills');
  return (
    <TabStyleContext.Provider value={{ styleMode, setStyleMode }}>
      {children}
    </TabStyleContext.Provider>
  );
};

export const useTabStyle = (): TabStyleContextValue => {
  const ctx = useContext(TabStyleContext);
  if (!ctx) throw new Error('useTabStyle must be used within TabStyleProvider');
  return ctx;
};

export type { StyleMode };
