import React from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';

type NavbarProps = {
  onSignupClick: () => void;
  userRole: 'freelancer' | 'client' | null;
};

const Navbar: React.FC<NavbarProps> = ({ onSignupClick, userRole }) => {
  const location = useLocation();
  const isProjectsPage = location.pathname === '/projects';

  return (
    <header className="navbar">
      <div className="logo">
        {/* Placeholder SVG logo */}
        <svg width="32" height="32" viewBox="0 0 32 32" style={{verticalAlign: 'middle', marginRight: 8}}>
          <ellipse cx="16" cy="16" rx="16" ry="16" fill="#b3eaff" />
          <ellipse cx="16" cy="16" rx="12" ry="6" fill="#8ee3fb" />
          <ellipse cx="16" cy="22" rx="12" ry="6" fill="#e6f6fb" />
        </svg>
        <span>KAZI PAY</span>
      </div>
      <div className="nav-actions">
        {userRole === null ? (
          <>
            <button className="login-btn">LOGIN</button>
            <button className="signup-btn" onClick={onSignupClick}>SIGN UP</button>
          </>
        ) : userRole === 'freelancer' ? (
          isProjectsPage ? (
            <Link to="/projects" className="signup-btn-link">
              <button className="signup-btn">My Projects</button>
            </Link>
          ) : (
            <Link to="/dashboard" className="signup-btn-link">
              <button className="signup-btn">Profile</button>
            </Link>
          )
        ) : (
          <Link to="/client" className="signup-btn-link">
            <button className="signup-btn">Create Project</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar; 