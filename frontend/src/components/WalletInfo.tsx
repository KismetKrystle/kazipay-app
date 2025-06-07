import React from 'react';
import { useWallet } from '../contexts/WalletContext';

const WalletInfo: React.FC = () => {
  const { wallet, isConnected, balance } = useWallet();

  if (!isConnected || !wallet) {
    return null;
  }

  return (
    <div className="wallet-info">
      <h3>Wallet Information</h3>
      <div className="wallet-details">
        <p><strong>Address:</strong> {wallet.classicAddress}</p>
        <p><strong>Seed:</strong> {wallet.seed}</p>
        <p><strong>Balance:</strong> {balance ? `${Number(balance) / 1000000} XRP` : 'Loading...'}</p>
      </div>
      <div className="wallet-warning">
        <p>⚠️ Important: Save your seed phrase securely. This is your private key to access your wallet.</p>
      </div>
    </div>
  );
};

export default WalletInfo; 