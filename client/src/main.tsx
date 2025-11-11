import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import DocsPage from './components/pages/DocsPages.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router >
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/docs" element={<DocsPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)
