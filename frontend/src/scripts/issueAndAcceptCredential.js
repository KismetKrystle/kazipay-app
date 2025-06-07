import { Client, Wallet, convertStringToHex, isoTimeToRippleTime } from 'xrpl';
import readline from 'readline';

const NETWORKS = {
    devnet: "wss://s.devnet.rippletest.net:51233"
};

async function issueAndAcceptCredential() {
    const client = new Client(NETWORKS.devnet);
    await client.connect();

    try {
        // Step 1: Create and fund a new wallet
        console.log('Creating and funding new wallet...');
        const { wallet: subjectWallet } = await client.fundWallet();
        console.log('Wallet created and funded successfully');
        console.log('Wallet Address:', subjectWallet.classicAddress);
        console.log('Wallet Seed:', subjectWallet.seed);

        // Step 2: Create issuer wallet
        console.log('\nCreating issuer wallet...');
        const issuerWallet = Wallet.fromSeed("sEdSXBiF6pNa9VwN9P3G42T3z1S23VF");
        console.log('Issuer wallet created:', issuerWallet.address);

        // Step 3: Issue credential
        console.log('\nIssuing credential...');
        const tx = {
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

        if (result.result.meta?.TransactionResult !== "tesSUCCESS") {
            throw new Error(`Transaction failed: ${result.result.meta?.TransactionResult}`);
        }
        console.log('Credential issued successfully');

        // Step 4: Accept credential
        console.log('\nAccepting credential...');
        const acceptTx = {
            TransactionType: "CredentialAccept",
            Account: subjectWallet.classicAddress,
            Issuer: issuerWallet.address,
            CredentialType: convertStringToHex("VERIFIED_USER").toUpperCase()
        };

        console.log('Preparing accept transaction...');
        const acceptPrepared = await client.autofill(acceptTx);
        const acceptSigned = subjectWallet.sign(acceptPrepared);
        const acceptResult = await client.submitAndWait(acceptSigned.tx_blob);

        if (acceptResult.result.meta?.TransactionResult !== "tesSUCCESS") {
            throw new Error(`Accept transaction failed: ${acceptResult.result.meta?.TransactionResult}`);
        }
        console.log('Credential accepted successfully');

        // Save wallet information
        console.log('\nSaving wallet information...');
        const walletInfo = {
            address: subjectWallet.classicAddress,
            seed: subjectWallet.seed,
            publicKey: subjectWallet.publicKey,
            privateKey: subjectWallet.privateKey
        };
        console.log('Wallet Information:', JSON.stringify(walletInfo, null, 2));
        console.log('\nIMPORTANT: Save this wallet information securely!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.disconnect();
    }
}

// Start the script
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Press Enter to start the credential issuance and acceptance process...', async () => {
    await issueAndAcceptCredential();
    rl.close();
}); 