import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import './ProjectsPage.css';

const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-container">
      <Navbar onSignupClick={() => {}} userRole="freelancer" />
      <div className="projects-main-content">
        <aside className="projects-sidebar">
          <nav className="sidebar-nav">
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
            <Link to="/projects" className="nav-item active">Projects</Link>
            <a href="#payments" className="nav-item">Payments</a>
            <a href="#settings" className="nav-item">Settings</a>
          </nav>
        </aside>
        <main className="projects-content-area">
          <div className="projects-grid">
            {/* Project Alpha Card */}
            <div className="card project-card">
              <h3>Project Alpha</h3>
              <p className="client-name">Client: Global Agency</p>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: '75%' }}></div>
              </div>
              <p className="progress-text">Progress: 75%</p>
              <ul className="milestones-list">
                <li>Milestone 1: Design Phase - Completed</li>
                <li>Milestone 2: Development - In Progress</li>
                <li>Milestone 3: Testing - Pending</li>
              </ul>
              <button className="project-details-btn">Project Details</button>
            </div>

            {/* Project Beta Card */}
            <div className="card project-card">
              <h3>Project Beta</h3>
              <p className="client-name">Client: Web Labs</p>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: '50%' }}></div>
              </div>
              <p className="progress-text">Progress: 50%</p>
              <ul className="milestones-list">
                <li>Milestone 1: Research - Completed</li>
                <li>Milestone 2: Development - In Progress</li>
                <li>Milestone 3: Review - Pending</li>
              </ul>
              <button className="project-details-btn">Project Details</button>
            </div>

            {/* Project Gamma Card */}
            <div className="card project-card">
              <h3>Project Gamma</h3>
              <p className="client-name">Client: Emily Davis</p>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: '90%' }}></div>
              </div>
              <p className="progress-text">Progress: 90%</p>
              <ul className="milestones-list">
                <li>Milestone 1: Planning - Completed</li>
                <li>Milestone 2: Execution - In Progress</li>
                <li>Milestone 3: Delivery - Pending</li>
              </ul>
              <button className="project-details-btn">Project Details</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage; 