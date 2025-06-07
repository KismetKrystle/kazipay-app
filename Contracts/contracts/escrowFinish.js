// contracts/escrowFinish.js
const xrpl = require('xrpl')
require('dotenv').config()

async function finishEscrow(sequence) {
  const client = new xrpl.Client(process.env.XRPL_NETWORK)
  await client.connect()

  const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_CLIENT_SEED)

  const tx = {
    TransactionType: "EscrowFinish",
    Owner: wallet.address,
    OfferSequence: sequence,
    Account: wallet.address,
    Fee: "12"
  }

  const submit = await client.submitAndWait(tx, { wallet })
  console.log("EscrowFinish TX hash:", submit.result.hash)
  await client.disconnect()
}

module.exports = { finishEscrow }
