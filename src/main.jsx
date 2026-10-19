import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource-variable/unbounded';
import '@fontsource-variable/manrope';
import '@fontsource-variable/caveat';
import './styles/base.css';

import App from './App.jsx';
import FxProvider from './fx/FxProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FxProvider>
      <App />
    </FxProvider>
  </StrictMode>,
);
