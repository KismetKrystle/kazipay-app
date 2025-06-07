import { Client, Wallet } from 'xrpl';

interface Transaction {
  TransactionType: string;
  Account: string;
  Destination?: string;
  Amount?: string;
  date: number;
  [key: string]: any;
}

interface CreditScoreFactors {
  successfulTransactions: number;
  paymentTransactions: number;
  accountAge: number;
  totalVolume: number;
  averageTransactionSize: number;
  verificationStatus: boolean;
}

export class CreditScoreCalculator {
  private client: Client;
  private wallet: Wallet;

  constructor(wallet: Wallet) {
    this.client = new Client("wss://s.devnet.rippletest.net:51233");
    this.wallet = wallet;
  }

  private async getTransactionHistory(): Promise<Transaction[]> {
    try {
      await this.client.connect();
      
      const response = await this.client.request({
        command: "account_tx",
        account: this.wallet.classicAddress,
        limit: 100
      });

      return response.result.transactions.map((tx: any) => ({
        ...tx.tx,
        date: tx.tx.date
      }));
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      return [];
    } finally {
      await this.client.disconnect();
    }
  }

  private calculateFactors(transactions: Transaction[]): CreditScoreFactors {
    const now = Math.floor(Date.now() / 1000);
    const firstTransaction = transactions[0]?.date || now;
    const accountAge = Math.floor((now - firstTransaction) / (24 * 60 * 60)); // Age in days

    const successfulTransactions = transactions.filter(tx => 
      tx.TransactionResult === "tesSUCCESS"
    ).length;

    const paymentTransactions = transactions.filter(tx => 
      tx.TransactionType === "Payment" && tx.TransactionResult === "tesSUCCESS"
    ).length;

    const totalVolume = transactions.reduce((sum, tx) => {
      if (tx.TransactionType === "Payment" && tx.Amount) {
        return sum + Number(tx.Amount);
      }
      return sum;
    }, 0);

    const averageTransactionSize = paymentTransactions > 0 
      ? totalVolume / paymentTransactions 
      : 0;

    return {
      successfulTransactions,
      paymentTransactions,
      accountAge,
      totalVolume,
      averageTransactionSize,
      verificationStatus: true // This will be updated based on DID verification
    };
  }

  private calculateScore(factors: CreditScoreFactors): number {
    let score = 300; // Base score

    // Transaction success rate (up to 100 points)
    const successRate = factors.successfulTransactions / Math.max(factors.successfulTransactions, 1);
    score += successRate * 100;

    // Payment transaction count (up to 100 points)
    score += Math.min(factors.paymentTransactions * 10, 100);

    // Account age (up to 100 points)
    score += Math.min(factors.accountAge * 2, 100);

    // Transaction volume (up to 100 points)
    const volumeScore = Math.min(factors.totalVolume / 1000000, 100);
    score += volumeScore;

    // Average transaction size (up to 100 points)
    const avgTxScore = Math.min(factors.averageTransactionSize / 10000, 100);
    score += avgTxScore;

    // Verification bonus (50 points)
    if (factors.verificationStatus) {
      score += 50;
    }

    // Cap the score at 850
    return Math.min(Math.floor(score), 850);
  }

  public async calculateCreditScore(): Promise<number> {
    try {
      const transactions = await this.getTransactionHistory();
      const factors = this.calculateFactors(transactions);
      return this.calculateScore(factors);
    } catch (error) {
      console.error("Error calculating credit score:", error);
      return 300; // Return minimum score on error
    }
  }
} 