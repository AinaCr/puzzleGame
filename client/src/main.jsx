// ======================= IMPORTATIONS =======================
import { StrictMode } from 'react'                  // Mode strict React pour détecter les erreurs
import { createRoot } from 'react-dom/client'      // Création du root React moderne
import { createBrowserRouter, RouterProvider } from 'react-router-dom' // Router React
import App from './App.jsx'                        // Page d'accueil / login
import Puzzle from './components/Puzzle.jsx'                  // Composant puzzle
import Accueille from './page/Accueille.jsx'            // Composant principal après login
import Galerie from './components/galerie.jsx'                // Galerie des images / posts
import 'bootstrap/dist/css/bootstrap.min.css'      // Styles Bootstrap
import { AuthProvider } from './variables/variableExport.jsx' // Contexte global pour gérer l'état utilisateur

// ======================= ROUTER =======================
// Définition des routes de l'application
const router = createBrowserRouter([
  {
    path: '/',          // Route principale
    element: <App />,   // Affiche le composant App (login / inscription)
  },
  {
    path: 'Accueille',  // Route après connexion
    element: <Accueille /> // Affiche le composant principal Accueille
  }
  // Remarque : Puzzle et Galerie ne sont pas des routes directes, ils sont inclus dans Accueille
])

// ======================= RENDER =======================
// Création du root React dans l'élément HTML avec id 'root'
createRoot(document.getElementById('root')).render(
  <StrictMode>             {/* Mode strict React pour détecter les erreurs et avertissements */}
    <AuthProvider>         {/* Fournit le contexte global (user, puzzle, clash, etc.) */}
      <RouterProvider router={router} /> {/* Fournit le router à l'application */}
    </AuthProvider>
  </StrictMode>,
)
