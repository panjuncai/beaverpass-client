export interface PostSnapshot {
  postId: string;
  title: string;
  price: number;
  images: string[];
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
  _id: string;
  buyerId: {
    _id: string;
  };
  sellerId: {
    _id: string;
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

export type CreateOrderRequest = Omit<Order, '_id' | 'createdAt' | 'updatedAt' | 'status' | 'paymentInfo'>;