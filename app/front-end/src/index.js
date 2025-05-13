// src/index.js - Atualize a importação para corresponder à extensão do arquivo
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Note a extensão .jsx

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);