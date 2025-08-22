import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { TabStyleProvider } from './context/TabStyleContext';
import { LanguageProvider } from './context/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ThemeProvider>
    <TabStyleProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </TabStyleProvider>
  </ThemeProvider>
);
