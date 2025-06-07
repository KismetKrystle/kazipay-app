console.log("Starting escrow service script...");

const express = require('express');
const xrpl = require('xrpl');
const app = express();
app.use(express.json());

const NETWORKS = {
    devnet: "wss://s.devnet.rippletest.net:51233",
    testnet: "wss://s.altnet.rippletest.net:51233",
    mainnet: "wss://xrplcluster.com/"
};

let client;
let wallet;

process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception:', err);
});

// Validate escrow creation request
function validateEscrowRequest({ destination, amount, finishAfter, cancelAfter, condition }) {
    // Validate destination
    if (typeof destination !== "string") {
        throw new Error("Must provide a string 'destination' field");
    }
    if (!xrpl.isValidClassicAddress(destination)) {
        throw new Error(`destination not valid address: '${destination}'`);
    }

    // Validate amount
    if (typeof amount !== "string" || !amount.match(/^\d+(\.\d+)?$/)) {
        throw new Error("Must provide a valid 'amount' field");
    }

    // Validate finishAfter if provided
    let parsedFinishAfter;
    if (finishAfter !== undefined) {
        if (typeof finishAfter !== "string") {
            throw new Error(`Unsupported finishAfter format: ${typeof finishAfter}`);
        }
        parsedFinishAfter = new Date(finishAfter);
        if (isNaN(parsedFinishAfter.getTime())) {
            throw new Error(`Invalid finishAfter date: ${finishAfter}`);
        }
    }

    // Validate cancelAfter if provided
    let parsedCancelAfter;
    if (cancelAfter !== undefined) {
        if (typeof cancelAfter !== "string") {
            throw new Error(`Unsupported cancelAfter format: ${typeof cancelAfter}`);
        }
        parsedCancelAfter = new Date(cancelAfter);
        if (isNaN(parsedCancelAfter.getTime())) {
            throw new Error(`Invalid cancelAfter date: ${cancelAfter}`);
        }
    }

    // Validate that cancelAfter is after finishAfter if both are provided
    if (parsedFinishAfter && parsedCancelAfter && parsedCancelAfter <= parsedFinishAfter) {
        throw new Error("cancelAfter must be after finishAfter");
    }

    return {
        destination,
        amount,
        finishAfter: parsedFinishAfter,
        cancelAfter: parsedCancelAfter,
        condition
    };
}

async function startService(seed) {
    try {
        // Create a new client
        client = new xrpl.Client(NETWORKS.devnet);
        await client.connect();
        
        // Create wallet from seed
        wallet = xrpl.Wallet.fromSeed(seed);
        console.log("✅ Starting escrow service with XRPL address", wallet.address);
        
        // Start the server
        const port = 3006;
        app.listen(port, () => {
            console.log("🔐 Escrow service running on port:", port);
        });
    } catch (error) {
        console.error("Error starting service:", error);
        process.exit(1);
    }
}

// POST /escrow - Create new escrow
app.post('/escrow', async (req, res) => {
    try {
        const { destination, amount, finishTime, cancelTime } = req.body;
        
        // Convert XRP to drops
        const amountInDrops = xrpl.xrpToDrops(amount.toString());
        
        // Prepare escrow creation
        const escrowCreate = {
            TransactionType: "EscrowCreate",
            Account: wallet.address,
            Destination: destination,
            Amount: amountInDrops,
            FinishAfter: finishTime ? Math.floor(Date.now() / 1000) + (finishTime * 3600) : undefined,
            CancelAfter: cancelTime ? Math.floor(Date.now() / 1000) + (cancelTime * 3600) : undefined
        };

        // Submit and wait for validation
        const prepared = await client.autofill(escrowCreate);
        const signed = wallet.sign(prepared);
        const result = await client.submitAndWait(signed.tx_blob);

        console.log("Transaction result:", result.result.meta.TransactionResult);
        console.log("Transaction hash:", result.result.hash);

        // Get the sequence number from the transaction
        const sequence = result.result.tx_json.Sequence;
        console.log("Transaction sequence:", sequence);

        // Get escrow details
        const escrowResponse = await client.request({
            command: "account_objects",
            account: wallet.address,
            type: "escrow",
            ledger_index: "validated"
        });

        console.log("Escrow objects:", escrowResponse.result.account_objects);

        // Find the most recent escrow
        const escrows = escrowResponse.result.account_objects || [];
        const latestEscrow = escrows[0]; // Most recent escrow should be first

        res.json({
            success: true,
            message: "Escrow created successfully",
            transactionResult: result.result.meta.TransactionResult,
            sequence: sequence,
            escrowDetails: latestEscrow ? {
                owner: latestEscrow.Account,
                destination: latestEscrow.Destination,
                amount: xrpl.dropsToXrp(latestEscrow.Amount),
                sequence: latestEscrow.Sequence,
                finishAfter: latestEscrow.FinishAfter ? xrpl.rippleTimeToISOTime(latestEscrow.FinishAfter) : undefined,
                cancelAfter: latestEscrow.CancelAfter ? xrpl.rippleTimeToISOTime(latestEscrow.CancelAfter) : undefined
            } : null
        });
    } catch (error) {
        console.error("Error creating escrow:", error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            details: error.data || error.result || error
        });
    }
});

// POST /escrow/finish - Finish an escrow
app.post('/escrow/finish', async (req, res) => {
    try {
        const { owner, offerSequence, condition, fulfillment } = req.body;

        if (!owner || !offerSequence) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const tx = {
            "TransactionType": "EscrowFinish",
            "Account": wallet.address,
            "Owner": owner,
            "OfferSequence": offerSequence
        };

        if (condition) {
            tx.Condition = condition;
        }
        if (fulfillment) {
            tx.Fulfillment = fulfillment;
        }

        const prepared = await client.autofill(tx);
        const signed = wallet.sign(prepared);
        const result = await client.submitAndWait(signed.tx_blob);

        if (result.result.meta.TransactionResult !== "tesSUCCESS") {
            return res.status(400).json(result.result);
        }

        res.json(result.result);
    } catch (error) {
        console.error("Error finishing escrow:", error);
        res.status(400).json({ error: error.message });
    }
});

// POST /escrow/cancel - Cancel an escrow
app.post('/escrow/cancel', async (req, res) => {
    try {
        const { owner, offerSequence } = req.body;

        if (!owner || !offerSequence) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const tx = {
            "TransactionType": "EscrowCancel",
            "Account": wallet.address,
            "Owner": owner,
            "OfferSequence": offerSequence
        };

        const prepared = await client.autofill(tx);
        const signed = wallet.sign(prepared);
        const result = await client.submitAndWait(signed.tx_blob);

        if (result.result.meta.TransactionResult !== "tesSUCCESS") {
            return res.status(400).json(result.result);
        }

        res.json(result.result);
    } catch (error) {
        console.error("Error canceling escrow:", error);
        res.status(400).json({ error: error.message });
    }
});

// GET /escrow - List all escrows
app.get('/escrow', async (req, res) => {
    try {
        const response = await client.request({
            command: "account_objects",
            account: wallet.address,
            type: "escrow",
            ledger_index: "validated"
        });

        const escrows = response.result.account_objects || [];
        
        // Convert escrows to a more readable format
        const formattedEscrows = escrows.map(escrow => ({
            owner: escrow.Account,
            destination: escrow.Destination,
            amount: xrpl.dropsToXrp(escrow.Amount),
            sequence: escrow.Sequence,
            ledgerIndex: escrow.LedgerIndex,
            finishAfter: escrow.FinishAfter ? xrpl.rippleTimeToISOTime(escrow.FinishAfter) : undefined,
            cancelAfter: escrow.CancelAfter ? xrpl.rippleTimeToISOTime(escrow.CancelAfter) : undefined,
            condition: escrow.Condition,
            previousTxnID: escrow.PreviousTxnID,
            previousTxnLgrSeq: escrow.PreviousTxnLgrSeq
        }));

        res.json({ 
            escrows: formattedEscrows,
            rawResponse: response.result  // Include raw response for debugging
        });
    } catch (error) {
        console.error("Error listing escrows:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start the service
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('✔ Account seed: ', (seed) => {
    startService(seed);
    readline.close();
}); 