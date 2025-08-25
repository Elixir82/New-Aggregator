import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryProvider } from './context/queryContext.jsx'
import { APIStatusProvider } from './context/apiContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <APIStatusProvider>
      <App />
      </APIStatusProvider>
    </QueryProvider>   
  </StrictMode>,
)
