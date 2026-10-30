import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {initDashboardTheme} from './utils/themeManager';

// Initialize persistent dashboard appearance theme
initDashboardTheme();

// StrictMode hataya gaya hai taaki mobile Web3 listeners aur 3D memory double hokar phone freeze na kare
createRoot(document.getElementById('root')!).render(
  <App />
);
