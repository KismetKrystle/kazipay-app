import React, { createContext, useContext, useState } from 'react';
import { Client, Wallet, convertStringToHex, isoTimeToRippleTime } from 'xrpl';
import type { TransactionMetadata, CredentialCreate, CredentialAccept, TransactionMetadataBase } from 'xrpl';

interface CredentialContextType {
  issueAndAcceptCredential: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isVerified: boolean;
}

const CredentialContext = createContext<CredentialContextType | undefined>(undefined);

// Regex constants for validation
const CREDENTIAL_REGEX = /^[A-Za-z0-9_.-]{1,128}$/;
const URI_REGEX = /^[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=%]{1,256}$/;

// Validate credential request
function validateCredentialRequest(subject: string, credential: string, uri?: string, expiration?: string) {
  if (!subject) throw new Error("Subject is required");
  if (!credential) throw new Error("Credential type is required");
  return { subject, credential, uri, expiration };
}

export const CredentialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const issueAndAcceptCredential = async () => {
    setIsLoading(true);
    setError(null);
    let client: Client | null = null;

    try {
      console.log('Connecting to XRPL network...');
      client = new Client("wss://s.devnet.rippletest.net:51233");
      await client.connect();
      console.log('Connected to XRPL network');

      // Get the locally saved wallet
      const savedWallet = localStorage.getItem('xrpWallet');
      if (!savedWallet) {
        throw new Error('No wallet found in localStorage');
      }
      const parsedWallet = JSON.parse(savedWallet);
      const subjectWallet = Wallet.fromSeed(parsedWallet.seed);
      console.log('Using locally saved wallet address:', subjectWallet.classicAddress);

      // Create issuer wallet
      console.log('Creating issuer wallet...');
      const issuerWallet = Wallet.fromSeed("sEdSXBiF6pNa9VwN9P3G42T3z1S23VF");
      console.log('Issuer wallet created:', issuerWallet.address);

      // Issue credential
      console.log('Issuing credential...');
      const tx: CredentialCreate = {
        TransactionType: "CredentialCreate",
        Account: issuerWallet.address,
        Subject: subjectWallet.classicAddress,
        CredentialType: convertStringToHex("VERIFIED_USER").toUpperCase(),
        URI: convertStringToHex("https://kazipay.com/credentials/verified").toUpperCase(),
        Expiration: isoTimeToRippleTime(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString())
      };

      console.log('Preparing transaction...');
      const prepared = await client.autofill(tx);
      const signed = issuerWallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);

      // Check if credential already exists
      const metadata = result.result.meta as TransactionMetadataBase;
      if (metadata?.TransactionResult === "tecDUPLICATE") {
        console.log('Credential already exists, checking if it was accepted...');
        
        // Check if the credential was already accepted
        const acceptTx: CredentialAccept = {
          TransactionType: "CredentialAccept",
          Account: subjectWallet.classicAddress,
          Issuer: issuerWallet.address,
          CredentialType: convertStringToHex("VERIFIED_USER").toUpperCase()
        };

        try {
          const acceptPrepared = await client.autofill(acceptTx);
          const acceptSigned = subjectWallet.sign(acceptPrepared);
          const acceptResult = await client.submitAndWait(acceptSigned.tx_blob);
          
          const acceptMetadata = acceptResult.result.meta as TransactionMetadataBase;
          if (acceptMetadata?.TransactionResult === "tecDUPLICATE") {
            console.log('Credential was already accepted');
            setIsVerified(true);
            return;
          }
        } catch (error) {
          console.log('Credential exists but not accepted, proceeding with acceptance...');
        }
      } else if (metadata?.TransactionResult !== "tesSUCCESS") {
        throw new Error(`Transaction failed: ${metadata?.TransactionResult}`);
      }
      console.log('Credential issued successfully');

      // Accept credential
      console.log('Accepting credential...');
      const acceptTx: CredentialAccept = {
        TransactionType: "CredentialAccept",
        Account: subjectWallet.classicAddress,
        Issuer: issuerWallet.address,
        CredentialType: convertStringToHex("VERIFIED_USER").toUpperCase()
      };

      console.log('Preparing accept transaction...');
      const acceptPrepared = await client.autofill(acceptTx);
      const acceptSigned = subjectWallet.sign(acceptPrepared);
      const acceptResult = await client.submitAndWait(acceptSigned.tx_blob);

      const acceptMetadata = acceptResult.result.meta as TransactionMetadataBase;
      if (acceptMetadata?.TransactionResult === "tecDUPLICATE") {
        console.log('Credential was already accepted');
      } else if (acceptMetadata?.TransactionResult !== "tesSUCCESS") {
        throw new Error(`Accept transaction failed: ${acceptMetadata?.TransactionResult}`);
      } else {
        console.log('Credential accepted successfully');
      }

      // Set verified status
      setIsVerified(true);
      console.log('Verification complete!');

    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to verify credential');
      throw error;
    } finally {
      if (client?.isConnected()) {
        await client.disconnect();
      }
      setIsLoading(false);
    }
  };

  return (
    <CredentialContext.Provider value={{ issueAndAcceptCredential, isLoading, error, isVerified }}>
      {children}
    </CredentialContext.Provider>
  );
};

export const useCredential = () => {
  const context = useContext(CredentialContext);
  if (context === undefined) {
    throw new Error('useCredential must be used within a CredentialProvider');
  }
  return context;
}; 