import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <div className="sidebar-logo">
            <span>Kazi Pay</span>
          </div>
          <nav className="sidebar-nav">
            <Link to="/" className="nav-item active">Home</Link>
            <a href="#projects" className="nav-item">Projects</a>
            <a href="#wallet" className="nav-item">Wallet</a>
            <a href="#settings" className="nav-item">Settings</a>
          </nav>
        </aside>
        <main className="dashboard-content-area">
          <div className="dashboard-grid">
            {/* User Profile Card */}
            <div className="card user-profile-card">
              <div className="profile-header">
                <img src="https://via.placeholder.com/64" alt="Ayo Johnson" className="profile-avatar" />
                <div className="profile-info">
                  <h4>Ayo Johnson</h4>
                  <span className="verified-badge">✓ Verified</span>
                </div>
              </div>
              <p className="performance-score">Performance Score: 92</p>
              <p className="client-review">"Excellent collaborator and highly skilled." - Client Review</p>
            </div>

            {/* Active Projects Card */}
            <div className="card active-projects-card">
              <h3>Active Projects</h3>
              <div className="project-item">
                <span>Web Design A</span>
                <span className="progress-text">50% complete</span>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: '50%'}}></div></div>
              </div>
              <div className="project-item">
                <span>Website Video Project B</span>
                <span className="progress-text">75% complete</span>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: '75%'}}></div></div>
              </div>
            </div>

            {/* Milestones Card */}
            <div className="card milestones-card">
              <h3>Milestones</h3>
              <ul>
                <li>Design Phase - Completed</li>
                <li>Development Phase - In Progress</li>
                <li>Testing Phase - Upcoming</li>
              </ul>
            </div>

            {/* Wallet Balance Card */}
            <div className="card wallet-balance-card">
              <h3>Wallet Balance</h3>
              <p>554.75 XRP</p>
              <p className="approx-value">Approx. $1200</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage; 