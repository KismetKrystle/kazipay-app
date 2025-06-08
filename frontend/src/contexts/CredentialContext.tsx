import React, { createContext, useContext, useState } from 'react';
import { Client, Wallet, convertStringToHex, rippleTimeToISOTime } from 'xrpl';
import { useWallet } from './WalletContext';
import type { TransactionMetadataBase, CredentialAccept, CredentialCreate } from 'xrpl';

interface CredentialContextType {
  isVerified: boolean;
  isVerifying: boolean;
  verifyCredential: () => Promise<void>;
  getDid: () => Promise<void>;
}

interface CredentialObject {
  Flags: number;
  Expiration?: number;
  CredentialType: string;
  Issuer: string;
  Subject: string;
  [key: string]: any;
}

const CredentialContext = createContext<CredentialContextType | undefined>(undefined);

// Constants
const ISSUER_SEED = "sEdSXBiF6pNa9VwN9P3G42T3z1S23VF";
const ISSUER_ADDRESS = "rQpCShQiGGZ4pPN1ySoonnpPNH8WHrMwcz";
const CREDENTIAL_TYPE = "KYC_VERIFICATION";

export const CredentialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { wallet } = useWallet();
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyCredential = async () => {
    if (!wallet) return;
    
    setIsVerifying(true);
    const client = new Client("wss://s.devnet.rippletest.net:51233");
    
    try {
      await client.connect();
      console.log("Connected to devnet");

      // Encode credential type as hex
      const credentialTypeHex = convertStringToHex(CREDENTIAL_TYPE).toUpperCase();
      console.log(`Encoded credential type as hex: ${credentialTypeHex}`);

      // Look up the credential using account_objects
      const response = await client.request({
        command: "account_objects",
        account: wallet.classicAddress,
        type: "credential",
        ledger_index: "validated"
      });

      const credentials = (response.result.account_objects || []) as CredentialObject[];
      console.log("Found credentials:", credentials);

      // Find the matching credential
      const credential = credentials.find(c => 
        c.CredentialType === credentialTypeHex && 
        c.Issuer === ISSUER_ADDRESS
      );

      if (!credential) {
        console.log("Credential not found");
        setIsVerified(false);
        return;
      }

      // Check if the credential has been accepted
      const LSF_ACCEPTED = 0x00010000;
      if (!(credential.Flags & LSF_ACCEPTED)) {
        console.log("Credential is not accepted.");
        setIsVerified(false);
        return;
      }

      // Check if the credential is expired
      if (credential.Expiration) {
        const expirationTime = rippleTimeToISOTime(credential.Expiration);
        console.log(`Credential has expiration: ${expirationTime}`);

        // Get the current ledger time
        const ledgerResponse = await client.request({
          command: "ledger",
          ledger_index: "validated",
        });

        const closeTime = rippleTimeToISOTime(ledgerResponse.result.ledger.close_time);
        console.log(`Most recent validated ledger is: ${closeTime}`);

        if (new Date(closeTime) > new Date(expirationTime)) {
          console.log("Credential is expired.");
          setIsVerified(false);
          return;
        }
      }

      console.log("Credential is valid.");
      setIsVerified(true);

    } catch (err: any) {
      if (err.data?.error === "entryNotFound") {
        console.log("Credential was not found");
        setIsVerified(false);
      } else {
        console.error("Error:", err);
        throw err;
      }
    } finally {
      await client.disconnect();
      setIsVerifying(false);
    }
  };

  const getDid = async () => {
    if (!wallet) return;
    
    const client = new Client("wss://s.devnet.rippletest.net:51233");
    
    try {
      await client.connect();
      console.log("Connected to devnet");

      // Check if subject wallet exists on devnet
      let subjectWallet = wallet;
      try {
        await client.request({
          command: "account_info",
          account: wallet.classicAddress,
          ledger_index: "validated"
        });
      } catch (error: any) {
        if (error.data?.error === "actNotFound") {
          console.log("Subject wallet does not exist on devnet, creating new wallet...");
          const fundedWallet = await client.fundWallet();
          console.log("New wallet created:", fundedWallet);
          // Create a proper Wallet instance from the funded wallet
          if (fundedWallet.wallet.seed) {
            subjectWallet = Wallet.fromSeed(fundedWallet.wallet.seed);
          } else {
            throw new Error("Failed to get seed from funded wallet");
          }
        } else {
          throw error;
        }
      }

      // Create issuer wallet from seed
      const issuerWallet = Wallet.fromSeed(ISSUER_SEED);
      console.log("Issuer wallet:", issuerWallet.classicAddress);

      // Encode credential type as hex
      const credentialTypeHex = convertStringToHex(CREDENTIAL_TYPE).toUpperCase();
      console.log(`Encoded credential type as hex: ${credentialTypeHex}`);

      // Prepare the credential request
      const credentialRequest: CredentialCreate = {
        TransactionType: "CredentialCreate",
        Account: issuerWallet.classicAddress,
        Subject: subjectWallet.classicAddress,
        CredentialType: credentialTypeHex,
        Flags: 0,
      };

      // Submit the transaction
      const prepared = await client.autofill(credentialRequest);
      const signed = issuerWallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);

      // Check if the transaction was successful
      if (result.result.meta) {
        const metadata = result.result.meta as TransactionMetadataBase;
        if (metadata.TransactionResult === "tesSUCCESS") {
          console.log("Credential issued successfully");
          
          // Accept the credential
          const acceptRequest: CredentialAccept = {
            TransactionType: "CredentialAccept",
            Account: subjectWallet.classicAddress,
            Issuer: issuerWallet.classicAddress,
            CredentialType: credentialTypeHex,
          };

          const acceptPrepared = await client.autofill(acceptRequest);
          const acceptSigned = subjectWallet.sign(acceptPrepared);
          const acceptResult = await client.submitAndWait(acceptSigned.tx_blob);

          if (acceptResult.result.meta) {
            const acceptMetadata = acceptResult.result.meta as TransactionMetadataBase;
            if (acceptMetadata.TransactionResult === "tesSUCCESS") {
              console.log("Credential accepted successfully");
              // Verify the credential after acceptance
              await verifyCredential();
            } else {
              console.error("Failed to accept credential:", acceptMetadata.TransactionResult);
            }
          }
        } else if (metadata.TransactionResult === "tecDUPLICATE") {
          console.log("Credential already exists, checking if accepted...");
          // Verify the credential to check if it's accepted
          await verifyCredential();
        } else {
          console.error("Failed to issue credential:", metadata.TransactionResult);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      await client.disconnect();
    }
  };

  return (
    <CredentialContext.Provider value={{ isVerified, isVerifying, verifyCredential, getDid }}>
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