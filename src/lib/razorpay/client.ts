export interface RazorpayOrderPayload {
  amount: number; // in paise or base unit
  currency: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: 'order';
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid';
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayPaymentLinkResponse {
  id: string;
  short_url: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'expired';
  description: string;
  customer: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export class RazorpaySimulator {
  private static generateId(prefix: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = prefix + '_';
    for (let i = 0; i < 14; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  }

  static async createOrder(payload: RazorpayOrderPayload): Promise<RazorpayOrderResponse> {
    const orderId = this.generateId('order');
    return {
      id: orderId,
      entity: 'order',
      amount: payload.amount,
      amount_paid: 0,
      amount_due: payload.amount,
      currency: payload.currency || 'INR',
      receipt: payload.receipt || `rcpt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes: payload.notes || {},
      created_at: Math.floor(Date.now() / 1000)
    };
  }

  static async createPaymentLink(
    amount: number,
    description: string,
    customer: { name?: string; email?: string; contact?: string }
  ): Promise<RazorpayPaymentLinkResponse> {
    const linkId = this.generateId('plink');
    const slug = Math.random().toString(36).substring(2, 9);
    return {
      id: linkId,
      short_url: `https://rzp.io/i/${slug}`,
      amount: amount * 100, // in paise
      currency: 'INR',
      status: 'created',
      description,
      customer
    };
  }

  static async capturePayment(orderId: string, amount: number): Promise<{
    paymentId: string;
    orderId: string;
    status: 'captured';
    amount: number;
    currency: string;
    method: string;
  }> {
    const paymentId = this.generateId('pay');
    return {
      paymentId,
      orderId,
      status: 'captured',
      amount,
      currency: 'INR',
      method: 'upi'
    };
  }
}
