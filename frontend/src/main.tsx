import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App'
import Signup from './Signup'
import DashboardPage from './DashboardPage'
import ClientPage from './ClientPage'
import ProjectsPage from './ProjectsPage'
import { WalletProvider } from './contexts/WalletContext'
import { CredentialProvider } from './contexts/CredentialContext'
import './index.css'

// Wrapper component to access location state
const DashboardWrapper = () => {
  const location = useLocation();
  const { userRole } = location.state || { userRole: null };
  return <DashboardPage userRole={userRole} />;
};

// Wrapper component for Projects page
const ProjectsWrapper = () => {
  const location = useLocation();
  const { userRole } = location.state || { userRole: null };
  return <ProjectsPage userRole={userRole} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <CredentialProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/client" element={<ClientPage />} />
            <Route path="/projects" element={<ProjectsWrapper />} />
          </Routes>
        </BrowserRouter>
      </CredentialProvider>
    </WalletProvider>
  </React.StrictMode>
)
