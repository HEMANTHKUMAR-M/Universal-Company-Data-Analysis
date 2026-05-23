import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { FilterProvider } from './context/FilterContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </AuthProvider>
  </StrictMode>,
)
