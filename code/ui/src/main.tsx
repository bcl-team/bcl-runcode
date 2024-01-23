import { createRoot } from 'react-dom/client';
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { appStore } from './store';
import { App } from './App';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from './themes/dark-theme';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <Suspense fallback="loading">
    <ThemeProvider theme={darkTheme}>
      <Provider store={appStore}>
        <App />
      </Provider>
    </ThemeProvider>
  </Suspense>,
);
