import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/nk-a11y-text-scope.css'
import App from './App.tsx'
import { initVoices } from './utils/textToSpeech'
import { ErrorBoundary } from './components/others/ErrorBoundary'

// Inicializar las voces del navegador
initVoices();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
