import { StrictMode } from 'react'; // Importación correcta para StrictMode
import { createRoot } from 'react-dom/client'; // Importación correcta para createRoot
import './index.css';
import App from './App.jsx';
// La importación y el registro manual de serviceWorkerRegistration se eliminan
// porque vite-plugin-pwa se encarga de esto automáticamente.

// Usa la API moderna de React 18 para crear y renderizar la raíz de tu aplicación.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// La línea serviceWorkerRegistration.register(); se ha eliminado de aquí
// ya que el plugin VitePWA inyecta su propio script de registro en index.html.
