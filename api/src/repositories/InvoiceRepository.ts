import { Knex } from 'knex';
import { Invoice } from '../types/index.js';

/**
 * InvoiceRepository handles all invoice database operations
 */
export class InvoiceRepository {
  constructor(private knex: Knex) {}

  /**
   * Create a new invoice with unique invoice number
   */
  async create(
    userId: number,
    subscriptionId: number,
    amount: number,
    status: 'pending' | 'paid' | 'failed' = 'pending'
  ): Promise<Invoice> {
    const invoiceNumber = this.generateInvoiceNumber();

    const [invoice] = await this.knex('invoices')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        invoice_number: invoiceNumber,
        amount,
        status,
      })
      .returning('*');

    return invoice as Invoice;
  }

  /**
   * Find invoices by subscription ID
   */
  async findBySubscriptionId(subscriptionId: number): Promise<Invoice[]> {
    const invoices = await this.knex('invoices')
      .where({ subscription_id: subscriptionId })
      .orderBy('created_at', 'desc');

    return invoices as Invoice[];
  }

  /**
   * Find invoice by ID
   */
  async findById(id: number): Promise<Invoice | null> {
    const invoice = await this.knex('invoices').where({ id }).first();
    return (invoice as Invoice) || null;
  }

  /**
   * Generate unique invoice number
   * Format: INV-YYYYMMDD-XXXX
   * Example: INV-20231024-0001
   */
  private generateInvoiceNumber(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const sequence = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    return `INV-${year}${month}${day}-${sequence}`;
  }
}
