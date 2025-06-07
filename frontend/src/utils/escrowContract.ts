import { Client, Wallet, xrpToDrops, isoTimeToRippleTime } from 'xrpl';
import type { EscrowCreate, TransactionMetadata } from 'xrpl';

interface Milestone {
  title: string;
  amount: string;
}

interface EscrowData {
  projectTitle: string;
  totalAmount: string;
  milestones: Milestone[];
  timeline: string;
  clientAddress: string;
}

export class EscrowContract {
  private client: Client;
  private readonly NETWORK_URL = "wss://s.devnet.rippletest.net:51233";

  constructor() {
    this.client = new Client(this.NETWORK_URL);
  }

  private async connect() {
    if (!this.client.isConnected()) {
      await this.client.connect();
    }
  }

  private async disconnect() {
    if (this.client.isConnected()) {
      await this.client.disconnect();
    }
  }

  private convertToXRPLAmount(amount: string): string {
    // Convert XRP amount to drops (1 XRP = 1,000,000 drops)
    return xrpToDrops(amount);
  }

  private parseTimeline(timeline: string): number {
    // Convert dd/mm/yy to Ripple time
    const [day, month, year] = timeline.split('/').map(Number);
    const date = new Date(2000 + year, month - 1, day);
    return isoTimeToRippleTime(date.toISOString());
  }

  public async createEscrow(escrowData: EscrowData, clientWallet: Wallet): Promise<string> {
    try {
      await this.connect();

      // Convert total amount to drops
      const totalAmountDrops = this.convertToXRPLAmount(escrowData.totalAmount);
      
      // Parse timeline to Ripple time
      const finishAfter = this.parseTimeline(escrowData.timeline);

      // Create the escrow create transaction
      const escrowCreate: EscrowCreate = {
        TransactionType: "EscrowCreate",
        Account: clientWallet.classicAddress,
        Amount: totalAmountDrops,
        Destination: clientWallet.classicAddress, // For now, same as client. Will be updated with freelancer's address
        CancelAfter: finishAfter,
        FinishAfter: finishAfter,
        Condition: "", // We'll add conditions for milestone releases
        DestinationTag: 0,
        SourceTag: 0
      };

      // Prepare and sign the transaction
      const prepared = await this.client.autofill(escrowCreate);
      const signed = clientWallet.sign(prepared);
      
      // Submit the transaction
      const result = await this.client.submitAndWait(signed.tx_blob);

      if (result.result.meta && typeof result.result.meta === 'object' && 'TransactionResult' in result.result.meta) {
        const meta = result.result.meta as TransactionMetadata;
        if (meta.TransactionResult !== "tesSUCCESS") {
          throw new Error(`Transaction failed: ${meta.TransactionResult}`);
        }
      }

      // Return the transaction hash
      return result.result.hash;

    } catch (error) {
      console.error('Error creating escrow:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  public async getEscrowDetails(escrowId: string): Promise<any> {
    try {
      await this.connect();

      const response = await this.client.request({
        command: "account_objects",
        account: escrowId,
        type: "escrow"
      });

      return response.result.account_objects;
    } catch (error) {
      console.error('Error fetching escrow details:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
} 