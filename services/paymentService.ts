import api from './api';

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  itemType: 'note' | 'bundle';
  itemId: string;
  itemTitle: string;
}

export interface Purchase {
  _id: string;
  userId: string;
  itemType: 'note' | 'bundle';
  itemId: any;
  amount: number;
  paymentId: string;
  orderId: string;
  status: string;
  createdAt: string;
}

class PaymentService {
  async createOrder(itemType: 'note' | 'bundle', itemId: string): Promise<PaymentOrder> {
    try {
      const response = await api.post('/payments/create-order', {
        itemType,
        itemId
      });
      return response.data.order;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  async initiatePayment(itemType: 'note' | 'bundle', itemId: string): Promise<PaymentOrder> {
    return this.createOrder(itemType, itemId);
  }

  async startPayment(itemType: 'note' | 'bundle', itemId: string): Promise<PaymentOrder> {
    return this.createOrder(itemType, itemId);
  }

  async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string,
    itemType: string,
    itemId: string,
    amount: number
  ): Promise<Purchase> {
    try {
      const response = await api.post('/payments/verify', {
        orderId,
        paymentId,
        signature,
        itemType,
        itemId,
        amount
      });
      return response.data.purchase;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }

  async confirmPayment(
    orderId: string,
    paymentId: string,
    signature: string,
    itemType: string,
    itemId: string,
    amount: number
  ): Promise<Purchase> {
    return this.verifyPayment(orderId, paymentId, signature, itemType, itemId, amount);
  }

  async getUserPurchases(): Promise<Purchase[]> {
    try {
      const response = await api.get('/payments/purchases');
      return response.data.purchases || [];
    } catch (error) {
      console.error('Get purchases error:', error);
      return [];
    }
  }

  async getPurchases(): Promise<Purchase[]> {
    return this.getUserPurchases();
  }

  async getMyPurchases(): Promise<Purchase[]> {
    return this.getUserPurchases();
  }

  async checkAccess(itemType: 'note' | 'bundle', itemId: string): Promise<boolean> {
    try {
      const response = await api.get(`/payments/check-access/${itemType}/${itemId}`);
      return response.data.hasAccess;
    } catch (error) {
      return false;
    }
  }

  async hasAccess(itemType: 'note' | 'bundle', itemId: string): Promise<boolean> {
    return this.checkAccess(itemType, itemId);
  }

  async checkPaymentStatus(orderId: string): Promise<any> {
    console.warn('checkPaymentStatus not fully implemented');
    return { status: 'unknown' };
  }

  async getPaymentStatus(orderId: string): Promise<any> {
    return this.checkPaymentStatus(orderId);
  }
}

const paymentService = new PaymentService();
export default paymentService;

// ALL EXPORTS
export const createOrder = (itemType: 'note' | 'bundle', itemId: string) => 
  paymentService.createOrder(itemType, itemId);
export const initiatePayment = (itemType: 'note' | 'bundle', itemId: string) => 
  paymentService.initiatePayment(itemType, itemId);
export const startPayment = (itemType: 'note' | 'bundle', itemId: string) => 
  paymentService.startPayment(itemType, itemId);
export const verifyPayment = (orderId: string, paymentId: string, signature: string, itemType: string, itemId: string, amount: number) => 
  paymentService.verifyPayment(orderId, paymentId, signature, itemType, itemId, amount);
export const confirmPayment = (orderId: string, paymentId: string, signature: string, itemType: string, itemId: string, amount: number) => 
  paymentService.confirmPayment(orderId, paymentId, signature, itemType, itemId, amount);
export const getUserPurchases = () => paymentService.getUserPurchases();
export const getPurchases = () => paymentService.getPurchases();
export const getMyPurchases = () => paymentService.getMyPurchases();
export const checkAccess = (itemType: 'note' | 'bundle', itemId: string) => 
  paymentService.checkAccess(itemType, itemId);
export const hasAccess = (itemType: 'note' | 'bundle', itemId: string) => 
  paymentService.hasAccess(itemType, itemId);
export const checkPaymentStatus = (orderId: string) => 
  paymentService.checkPaymentStatus(orderId);
export const getPaymentStatus = (orderId: string) => 
  paymentService.getPaymentStatus(orderId);