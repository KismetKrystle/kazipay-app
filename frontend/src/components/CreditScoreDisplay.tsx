import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useCredential } from '../contexts/CredentialContext';

const CreditScoreDisplay: React.FC = () => {
  const { isConnected, wallet } = useWallet();
  const { isVerified } = useCredential();

  if (!isConnected || !wallet || !isVerified) {
    return null;
  }

  // Generate a credit score based on the last 4 characters of the wallet address
  const lastFourChars = wallet.classicAddress.slice(-4);
  const parsedValue = parseInt(lastFourChars, 16);
  const creditScore = isNaN(parsedValue) ? 300 : Math.floor(300 + (parsedValue % 550));

  return (
    <div className="credit-score-display">
      <img src="/star.png" alt="Star" className="star-icon" />
      <div className="credit-score-info">
        <span className="credit-score-label">Credit Score</span>
        <span className="credit-score-value">{creditScore}</span>
      </div>
    </div>
  );
};

export default CreditScoreDisplay; 