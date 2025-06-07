import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Signup from './Signup'
import DashboardPage from './DashboardPage'
import ClientPage from './ClientPage'
import { WalletProvider } from './contexts/WalletContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/client" element={<ClientPage />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  </React.StrictMode>
)
