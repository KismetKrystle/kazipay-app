// contracts/xrpl.js

const xrpl = require("xrpl");
require("dotenv").config();

// 1. Connect to the XRPL network
const client = new xrpl.Client(process.env.XRPL_NETWORK);

async function createEscrow(destinationAddress, amountXRP, finishAfterSeconds) {
  await client.connect();

  // 2. Load wallet
  const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_SEED);

  // 3. Prepare the escrow transaction
  const finishAfter = Math.floor(Date.now() / 1000) + finishAfterSeconds;

  const tx = {
    TransactionType: "EscrowCreate",
    Account: wallet.address,
    Destination: destinationAddress,
    Amount: xrpl.xrpToDrops(amountXRP.toString()), // e.g., "1000000" drops = 1 XRP
    FinishAfter: finishAfter,
  };

  // 4. Submit
  const response = await client.submitAndWait(tx, { wallet });

  console.log("Escrow created:", response.result.hash);

  await client.disconnect();
}

module.exports = { createEscrow };
