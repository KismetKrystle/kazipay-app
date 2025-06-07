import React, { useState } from 'react';
import './Navbar.css';
import { useWallet } from './contexts/WalletContext';

type NavbarProps = {
  onSignupClick?: () => void;
  isLoggedIn?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ onSignupClick, isLoggedIn }) => {
  const { 
    isConnected, 
    connectWallet, 
    disconnectWallet, 
    wallet, 
    balance,
    error,
    isLoading 
  } = useWallet();

  const [showWalletDetails, setShowWalletDetails] = useState(false);

  const handleWalletClick = async () => {
    if (isConnected) {
      setShowWalletDetails(!showWalletDetails);
    } else {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowWalletDetails(false);
  };

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
        <div className="wallet-container">
          <button 
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            onClick={handleWalletClick}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 
             isConnected ? `Wallet (${wallet?.classicAddress.slice(0, 6)}...)` : 
             'Connect Wallet'}
          </button>
          {isConnected && showWalletDetails && (
            <div className="wallet-dropdown">
              <div className="wallet-dropdown-content">
                <div className="wallet-info-section">
                  <h4>Wallet Details</h4>
                  <p><strong>Address:</strong> {wallet?.classicAddress}</p>
                  <p><strong>Seed:</strong> {wallet?.seed}</p>
                  <p><strong>Balance:</strong> {balance ? `${Number(balance) / 1000000} XRP` : 'Loading...'}</p>
                </div>
                <div className="wallet-warning">
                  <p>⚠️ Save your seed phrase securely!</p>
                </div>
                <button className="disconnect-btn" onClick={handleDisconnect}>
                  Disconnect Wallet
                </button>
              </div>
            </div>
          )}
        </div>
        {error && <div className="wallet-error">{error}</div>}
        {!isLoggedIn && <button className="signup-btn" onClick={onSignupClick}>SIGN UP</button>}
      </div>
    </header>
  );
};

export default Navbar; 