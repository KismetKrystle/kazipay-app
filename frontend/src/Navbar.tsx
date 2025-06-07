import React from 'react';
import './Navbar.css';

type NavbarProps = {
  onSignupClick?: () => void;
  isLoggedIn?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ onSignupClick, isLoggedIn }) => (
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
      {!isLoggedIn && <button className="login-btn">Connect Wallet</button>}
      <button className="signup-btn" onClick={onSignupClick}>SIGN UP</button>
    </div>
  </header>
);

export default Navbar; 