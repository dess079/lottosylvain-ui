import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shadcn';
import PreviousDrawTab from './PreviousDrawTab';
import GraphTab from './GraphTab';
import PredictionTab from './PredictionTab';
import LineChartTab from './LineChartTab';
import PieChartTab from './PieChartTab';
import ScatterPlotTab from './ScatterPlotTab';
import './TabsLotto.css';

/**
 * Composant d'onglets pour Lotto 649 avec chargement paresseux
 * Gère l'état des onglets et la transmission des props aux composants enfants
 */
const TabsLotto: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'previous' | 'graph' | 'prediction' | 'line' | 'pie' | 'scatter'>('previous');
  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (tabsListRef.current) {
        // setIsOverflowing(tabsListRef.current.scrollWidth > tabsListRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  /**
   * Gère le changement d'onglet et met à jour l'état actif
   */
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'previous' | 'graph' | 'prediction' | 'line' | 'pie' | 'scatter');
  };

  return (
    <Tabs defaultValue="previous" onValueChange={handleTabChange} className="w-full pt-0 mx-8">
      <TabsList className="flex w-full justify-evenly bg-background/50 backdrop-blur-sm rounded-3xl p-2 md:p-4 border border-border/50 gap-2 shadow-md dark:shadow-gray-900/30">
      
        <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-8 overflow-x-auto px-2 md:px-4 py-2" id="tabs-container" ref={tabsListRef}>
          <TabsTrigger 
            value="previous" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Dernier tirage officiel
          </TabsTrigger>
          <TabsTrigger 
            value="graph" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Graphique temporel
          </TabsTrigger>
          <TabsTrigger 
            value="prediction" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Prédiction IA
          </TabsTrigger>
          <TabsTrigger 
            value="line" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Graphique linéaire
          </TabsTrigger>
          <TabsTrigger 
            value="pie" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Graphique en secteurs
          </TabsTrigger>
          <TabsTrigger 
            value="scatter" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Graphique de dispersion
          </TabsTrigger>
        </div>

      </TabsList>

      {/* Tabs content */}
      <TabsContent value="previous" className="mt-8 tabs-lotto-animation">
        <PreviousDrawTab isActive={activeTab === 'previous'} />
      </TabsContent>
      <TabsContent value="graph" className="mt-8 tabs-lotto-animation">
        <GraphTab isActive={activeTab === 'graph'} />
      </TabsContent>
      <TabsContent value="prediction" className="mt-8 tabs-lotto-animation">
        <PredictionTab isActive={activeTab === 'prediction'} />
      </TabsContent>
      <TabsContent value="line" className="mt-8 tabs-lotto-animation">
        <LineChartTab isActive={activeTab === 'line'} />
      </TabsContent>
      <TabsContent value="pie" className="mt-8 tabs-lotto-animation">
        <PieChartTab isActive={activeTab === 'pie'} />
      </TabsContent>
      <TabsContent value="scatter" className="mt-8 tabs-lotto-animation">
        <ScatterPlotTab isActive={activeTab === 'scatter'} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsLotto;
