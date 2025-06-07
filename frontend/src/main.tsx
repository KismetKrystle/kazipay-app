import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Signup from './Signup'
import DashboardPage from './DashboardPage'
import ClientPage from './ClientPage'
import { WalletProvider } from './contexts/WalletContext'
import { CredentialProvider } from './contexts/CredentialContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <CredentialProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/client" element={<ClientPage />} />
          </Routes>
        </BrowserRouter>
      </CredentialProvider>
    </WalletProvider>
  </React.StrictMode>
)
