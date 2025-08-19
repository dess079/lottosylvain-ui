import React, { useState } from 'react';
import { useTabStyle } from '../../../context/TabStyleContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './index';
import PreviousDrawTab from '../PreviousDrawTab';
import GraphTab from '../GraphTab';
import PredictionTab from '../../prediction/PredictionTab';
import LineChartTab, { NumberFrequencyBarChart } from '../LineChartTab';
import PieChartTab from '../PieChartTab';
import ScatterPlotTab from '../ScatterPlotTab';
import PredictionSection from '../../prediction/PredictionSection';
import AITab from '../AITab';
// Styling now handled with Tailwind classes and shadcn primitives — removed CSS file
import PredictionsTab from '../../../features/ai-predictions/components/PredictionsTab';
import { DirectAITab } from '@/components/directai';
// translations handled in TabCard
import TabCard, { getTriggerClasses } from '../../shadcn/ui/TabCard';


const TabsLotto: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'previous' | 'graph' | 'prediction' | 'section' | 'line' | 'pie' | 'scatter' | 'ai' | 'directai' | 'aipreds'>('previous');
  // styleMode is provided by context (toolbar controls it)
  const { styleMode } = useTabStyle();

  const handleTabChange = (value: string) => {
    setActiveTab(value as any);
  };

  // No underline: segmented mode uses an encadré (bordered) on the active item handled by TabCard styles.

  const TabItem: React.FC<{ value: string; label: string }> = ({ value, label }) => {
    const isActive = activeTab === value;
    const triggerClass = getTriggerClasses(isActive, styleMode as 'pills' | 'segmented');

    return (
      <TabsTrigger value={value} className={triggerClass} aria-pressed={isActive}>
        <TabCard labelKey={label} />
      </TabsTrigger>
    );
  };

  return (
  <Tabs defaultValue={activeTab} onValueChange={handleTabChange} activationMode="automatic" className="flex-1 flex flex-col min-h-0">
      <div className="p-2">
        <div className="w-full overflow-x-auto overflow-y-hidden scroll-smooth pb-2">
          <div className="flex items-center gap-4">
            <div className="relative w-full">
              <TabsList className="inline-flex gap-3 min-w-max">
                <TabItem value="previous" label="previous" />
                <TabItem value="prediction" label="prediction" />
                <TabItem value="graph" label="graph" />
                <TabItem value="section" label="section" />
                <TabItem value="line" label="line" />
                <TabItem value="pie" label="pie" />
                <TabItem value="scatter" label="scatter" />
                <TabItem value="ai" label="ai" />
                <TabItem value="directai" label="directai" />
                <TabItem value="aipreds" label="aipreds" />
              </TabsList>
            </div>

            {/* style switch moved to toolbar */}
          </div>
        </div>
      </div>

      <TabsContent value="previous" className="flex-1 min-h-0 flex flex-col overflow-y-auto"><PreviousDrawTab isActive={activeTab === 'previous'} /></TabsContent>
      <TabsContent value="prediction" className="flex-1 min-h-0 flex flex-col overflow-y-auto"><PredictionSection /></TabsContent>
      <TabsContent value="graph" className="flex-1 min-h-0 flex flex-col overflow-y-auto"><GraphTab isActive={activeTab === 'graph'} /></TabsContent>
      <TabsContent value="section" className="flex-1 min-h-0 flex flex-col overflow-y-auto"><PredictionTab /></TabsContent>
      <TabsContent value="line" className="flex-1 min-h-0 flex flex-col overflow-y-auto"><NumberFrequencyBarChart isActive={activeTab === 'line'} /></TabsContent>
      <TabsContent value="pie" className="flex-1 min-h-0 flex flex-col overflow-y-auto"><PieChartTab isActive={activeTab === 'pie'} /></TabsContent>
      <TabsContent value="scatter" className="flex-1 min-h-0 flex flex-col overflow-y-auto"><ScatterPlotTab isActive={activeTab === 'scatter'} /></TabsContent>
      <TabsContent value="ai" className="flex-1 min-h-0 flex flex-col overflow-y-auto"><AITab /></TabsContent>
      <TabsContent value="directai" className="flex-1 min-h-0 flex flex-col overflow-hidden"><DirectAITab /></TabsContent>
      <TabsContent value="aipreds" className="flex-1 min-h-0 flex flex-col overflow-y-auto"><PredictionsTab /></TabsContent>
    </Tabs>
  );
};

export default TabsLotto;
