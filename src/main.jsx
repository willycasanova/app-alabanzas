import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Este es el único BrowserRouter que debe existir en tu aplicación */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>
);