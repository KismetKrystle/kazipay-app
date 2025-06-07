import React, { useRef, useState } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/64");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar onSignupClick={() => {}} userRole="freelancer" />
      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <Link to="/" className="nav-item active">Home</Link>
            <Link to="/projects" className="nav-item">My Projects</Link>
            <a href="#settings" className="nav-item">Settings</a>
          </nav>
        </aside>
        <main className="dashboard-content-area">
          <div className="dashboard-grid">
            {/* User Profile Card */}
            <div className="card user-profile-card">
              <div className="profile-header">
                <div className="profile-image-container" onClick={handleImageClick}>
                  <img src={profileImage} alt="Ayo Johnson" className="profile-avatar" />
                  <div className="profile-image-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="white"/>
                      <path d="M20 4H16.83L15 2H9L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H8.05L9.88 4H14.12L15.95 6H20V18ZM12 8C9.24 8 7 10.24 7 13C7 15.76 9.24 18 12 18C14.76 18 17 15.76 17 13C17 10.24 14.76 8 12 8Z" fill="white"/>
                    </svg>
                    <span>Upload Photo</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
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