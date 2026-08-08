import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initStorage } from './storage/MMKVStorage';

// Kick off persistence hydration before first render (no-op on web).
initStorage();

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
