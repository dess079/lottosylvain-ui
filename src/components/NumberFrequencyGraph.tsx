import React, { CSSProperties, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useTheme } from '../context/ThemeContext';
import ErrorBoundary from './ErrorBoundary';

// Register all necessary Chart.js components
Chart.register(...registerables);

interface NumberFrequencyGraphProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
  style?: CSSProperties;
}

/**
 * Component to render the "Frequency of Numbers (1 to 49)" graph.
 * Supports light and dark mode.
 */
const NumberFrequencyGraph: React.FC<NumberFrequencyGraphProps> = ({ data, options, style }) => {
  const { theme } = useTheme();
  const chartRef = useRef<Chart | null>(null);

  // Validate data
  if (!data || !data.datasets || data.datasets.length === 0) {
    console.warn('NumberFrequencyGraph: Invalid or empty data provided.');
    return <div>No data available to display.</div>;
  }

  const dynamicOptions: ChartOptions<'line'> = {
    ...options,
    plugins: {
      ...options?.plugins,
      legend: {
        labels: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
      },
      y: {
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      // Cleanup Chart.js instance to avoid canvas reuse errors
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <div style={{ height: '500px', width: '100%', ...style }}>
        <Line
          ref={(chart) => {
            if (chart) {
              chartRef.current = chart;
            }
          }}
          data={data}
          options={dynamicOptions}
        />
      </div>
    </ErrorBoundary>
  );
};

export default NumberFrequencyGraph;
