import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shadcn';
import PreviousDrawTab from './PreviousDrawTab';
import GraphTab from './GraphTab';
import PredictionTab from './PredictionTab';
import './TabsLotto.css';

/**
 * Composant d'onglets pour Lotto 649 avec chargement paresseux
 * Gère l'état des onglets et la transmission des props aux composants enfants
 */
const TabsLotto: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'previous' | 'graph' | 'prediction'>('previous');

  /**
   * Gère le changement d'onglet et met à jour l'état actif
   */
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'previous' | 'graph' | 'prediction');
  };

  return (
      <Tabs defaultValue="previous" onValueChange={handleTabChange} className="w-full" style={{ paddingTop: '0px' }}>
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm rounded-2xl p-2 border border-border/50">
          <TabsTrigger 
            value="previous" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 data-[state=inactive]:bg-background/60 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border data-[state=inactive]:border-border/30 rounded-xl font-semibold transition-all duration-300 hover:bg-muted hover:text-foreground"
          >
            Dernier tirage officiel
          </TabsTrigger>
          <TabsTrigger 
            value="graph" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 data-[state=inactive]:bg-background/60 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border data-[state=inactive]:border-border/30 rounded-xl font-semibold transition-all duration-300 hover:bg-muted hover:text-foreground"
          >
            Graphique temporel
          </TabsTrigger>
          <TabsTrigger 
            value="prediction" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 data-[state=inactive]:bg-background/60 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border data-[state=inactive]:border-border/30 rounded-xl font-semibold transition-all duration-300 hover:bg-muted hover:text-foreground"
          >
            Prédiction IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="previous" className="mt-8 tabs-lotto-animation">
          <PreviousDrawTab isActive={activeTab === 'previous'} />
        </TabsContent>

        <TabsContent value="graph" className="mt-8 tabs-lotto-animation">
          <GraphTab isActive={activeTab === 'graph'} />
        </TabsContent>

        <TabsContent value="prediction" className="mt-8 tabs-lotto-animation">
          <PredictionTab isActive={activeTab === 'prediction'} />
        </TabsContent>
      </Tabs>
   
  );
};

export default TabsLotto;
