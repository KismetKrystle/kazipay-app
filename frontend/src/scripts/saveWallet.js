import { Client } from 'xrpl';
import readline from 'readline';

const NETWORKS = {
    devnet: "wss://s.devnet.rippletest.net:51233",
    testnet: "wss://s.altnet.rippletest.net:51233",
    mainnet: "wss://xrplcluster.com/"
};

async function saveWallet() {
    const client = new Client(NETWORKS.devnet);
    await client.connect();

    try {
        console.log('Creating and funding new wallet...');
        const { wallet: newWallet } = await client.fundWallet();
        console.log('Wallet created and funded successfully');
        
        // Save wallet to localStorage
        localStorage.setItem('xrpWallet', JSON.stringify(newWallet));
        console.log('Wallet saved to localStorage');
        console.log('Wallet Address:', newWallet.classicAddress);
        console.log('Wallet Seed:', newWallet.seed);
        
        // Get initial balance
        console.log('Fetching wallet balance...');
        const response = await client.request({
            command: "account_info",
            account: newWallet.classicAddress,
            ledger_index: "validated"
        });

        const balance = response.result.account_data.Balance;
        console.log('Wallet Balance:', Number(balance) / 1000000, 'XRP');

    } catch (error) {
        console.error('Error saving wallet:', error);
    } finally {
        await client.disconnect();
    }
}

// Start the script
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Press Enter to create and save a new wallet...', async () => {
    await saveWallet();
    rl.close();
}); 