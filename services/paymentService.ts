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
   private static localCouponDiscounts: Record<string, number> = {
    SW10A1B2C3D4E5F6: 10, SW10G7H8J9K1L2M3: 10, SW10N4P5Q6R7S8T9: 10, SW10U1V2W3X4Y5Z6: 10, SW107A8B9C1D2E3F: 10,
    SW10G4H5J6K7L8M9: 10, SW10N1P2Q3R4S5T6: 10, SW10U7V8W9X1Y2Z3: 10, SW104A5B6C7D8E9F: 10, SW10G1H2J3K4L5M6: 10,
    SW20A1B2C3D4E5F6: 20, SW20G7H8J9K1L2M3: 20, SW20N4P5Q6R7S8T9: 20, SW20U1V2W3X4Y5Z6: 20, SW207A8B9C1D2E3F: 20,
    SW20G4H5J6K7L8M9: 20, SW20N1P2Q3R4S5T6: 20, SW20U7V8W9X1Y2Z3: 20, SW204A5B6C7D8E9F: 20, SW20G1H2J3K4L5M6: 20,
    SW30A1B2C3D4E5F6: 30, SW30G7H8J9K1L2M3: 30, SW30N4P5Q6R7S8T9: 30, SW30U1V2W3X4Y5Z6: 30, SW307A8B9C1D2E3F: 30,
    SW30G4H5J6K7L8M9: 30, SW30N1P2Q3R4S5T6: 30, SW30U7V8W9X1Y2Z3: 30, SW304A5B6C7D8E9F: 30, SW30G1H2J3K4L5M6: 30,
    SW40A1B2C3D4E5F6: 40, SW40G7H8J9K1L2M3: 40, SW40N4P5Q6R7S8T9: 40, SW40U1V2W3X4Y5Z6: 40, SW407A8B9C1D2E3F: 40,
    SW40G4H5J6K7L8M9: 40, SW40N1P2Q3R4S5T6: 40, SW40U7V8W9X1Y2Z3: 40, SW404A5B6C7D8E9F: 40, SW40G1H2J3K4L5M6: 40,
    SW50A1B2C3D4E5F6: 50, SW50G7H8J9K1L2M3: 50, SW50N4P5Q6R7S8T9: 50, SW50U1V2W3X4Y5Z6: 50, SW507A8B9C1D2E3F: 50,
    SW50G4H5J6K7L8M9: 50, SW50N1P2Q3R4S5T6: 50, SW50U7V8W9X1Y2Z3: 50, SW504A5B6C7D8E9F: 50, SW50G1H2J3K4L5M6: 50
  };
 async createOrder(itemType: 'note' | 'bundle', itemId: string, couponCode?: string): Promise<PaymentOrder> {
      try {
      const response = await api.post('/payments/create-order', {
        itemType,
        itemId,
        couponCode
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

async validateCoupon(couponCode: string): Promise<{ code: string; discountPercent: number }> {
      const normalized = couponCode.trim().toUpperCase();
    try {
      const response = await api.post('/payments/validate-coupon', { couponCode: normalized });
      return response.data.coupon;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        const discountPercent = PaymentService.localCouponDiscounts[normalized];
        if (discountPercent) return { code: normalized, discountPercent };
      }
      throw error;
    }
  }

}

const paymentService = new PaymentService();
export default paymentService;

// ALL EXPORTS
export const createOrder = (itemType: 'note' | 'bundle', itemId: string, couponCode?: string) => 
  paymentService.createOrder(itemType, itemId, couponCode);
export const validateCoupon = (couponCode: string) =>
  paymentService.validateCoupon(couponCode);
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