export interface PostSnapshot {
  postId: string;
  title: string;
  price: number;
  images: {
    FRONT: string;
    BACK: string;
    LEFT: string;
    RIGHT: string;
  };
}

export interface ShippingInfo {
  address: string;
  receiver: string;
  phone: string;
}

export interface PaymentInfo {
  method: string;
  transactionId: string;
}

export interface Order {
  id: string;
  buyerId: {
    id: string;
  };
  sellerId: {
    id: string;
  };
  postSnapshot: PostSnapshot;
  amount: number;
  deliveryFee: number;
  tax: number;
  serviceFee: number;
  paymentFee: number;
  total: number;
  status: 'pending_payment' | 'paid' | 'shipped' | 'completed' | 'canceled' | 'refunded';
  paymentInfo: PaymentInfo;
  shippingInfo: ShippingInfo;
  createdAt: string;
  updatedAt: string;
}

export type CreateOrderRequest = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'paymentInfo'>;