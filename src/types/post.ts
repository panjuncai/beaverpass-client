export interface PostPrice {
  amount: number;
  isFree: boolean;
  isNegotiable: boolean;
}

export interface PostImages {
  FRONT: string | null;
  SIDE?: string | null;
  BACK?: string | null;
  DAMAGE?: string | null;
}

export interface BasePost {
  category: string;
  title: string;
  description: string;
  condition: string;
  images: PostImages;
  price: PostPrice;
  delivery: string;
  deliveryType: DeliveryType;
  status: PostStatus;
}

export enum PostStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SOLD = 'sold',
  DELETED = 'deleted',
}

export enum DeliveryType {
  HOME_DELIVERY = 'Home Delivery',
  PICKUP = 'Pickup',
  BOTH = 'Both'
}

export interface Post extends BasePost {
  _id: string;
  createdAt: string;
  updatedAt: string;
  poster: { _id: string };
  
}

export type CreatePostRequest = BasePost 