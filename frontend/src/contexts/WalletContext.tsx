import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Wallet } from 'xrpl';

interface WalletContextType {
  wallet: Wallet | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  balance: string | null;
  error: string | null;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        console.log('Initializing XRPL client...');
        const xrplClient = new Client("wss://s.devnet.rippletest.net:51233");
        await xrplClient.connect();
        console.log('XRPL client connected successfully');
        setClient(xrplClient);

        // Load saved wallet from localStorage
        const savedWallet = localStorage.getItem('xrpWallet');
        if (savedWallet) {
          try {
            console.log('Loading saved wallet...');
            const parsedWallet = JSON.parse(savedWallet);
            const walletInstance = Wallet.fromSeed(parsedWallet.seed);
            setWallet(walletInstance);
            setIsConnected(true);
            console.log('Saved wallet loaded successfully');

            // Get balance for saved wallet
            const response = await xrplClient.request({
              command: "account_info",
              account: walletInstance.classicAddress,
              ledger_index: "validated"
            });
            setBalance(response.result.account_data.Balance);
          } catch (error) {
            console.error('Error loading saved wallet:', error);
            localStorage.removeItem('xrpWallet');
            setError('Failed to load saved wallet');
          }
        }
      } catch (error) {
        console.error('Error initializing XRPL client:', error);
        setError('Failed to connect to XRPL network');
      }
    };

    initializeClient();

    return () => {
      if (client?.isConnected()) {
        console.log('Disconnecting XRPL client...');
        client.disconnect();
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!client) {
      setError('XRPL client not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Connecting to XRPL network...');
      if (!client.isConnected()) {
        await client.connect();
      }
      
      console.log('Creating and funding new wallet...');
      const { wallet: newWallet } = await client.fundWallet();
      console.log('Wallet created and funded successfully:', newWallet);
      
      // Save wallet to state and localStorage
      setWallet(newWallet);
      setIsConnected(true);
      localStorage.setItem('xrpWallet', JSON.stringify({
        seed: newWallet.seed,
        classicAddress: newWallet.classicAddress
      }));

      // Get initial balance
      console.log('Fetching wallet balance...');
      const response = await client.request({
        command: "account_info",
        account: newWallet.classicAddress,
        ledger_index: "validated"
      });

      setBalance(response.result.account_data.Balance);
      console.log('Wallet balance fetched successfully:', response.result.account_data.Balance);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
      setIsConnected(false);
      setWallet(null);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    console.log('Disconnecting wallet...');
    setWallet(null);
    setIsConnected(false);
    setBalance(null);
    localStorage.removeItem('xrpWallet');
    setError(null);
  };

  return (
    <WalletContext.Provider value={{ 
      wallet, 
      isConnected, 
      connectWallet, 
      disconnectWallet, 
      balance,
      error,
      isLoading 
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 