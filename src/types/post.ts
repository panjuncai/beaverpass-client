import { User } from './user';
import { GraphQLBaseResponse } from './api';

// 枚举类型
export enum PostCategory {
  Living_Room_Furniture = 'Living_Room_Furniture',
  Bedroom_Furniture = 'Bedroom_Furniture',
  Dining_Room_Furniture = 'Dining_Room_Furniture',
  Office_Furniture = 'Office_Furniture',
  Outdoor_Furniture = 'Outdoor_Furniture',
  Storage = 'Storage',
  Other = 'Other'
}

export enum PostCondition {
  Like_New = 'Like_New',
  Gently_Used = 'Gently_Used',
  Minor_Scratches = 'Minor_Scratches',
  Stains = 'Stains',
  Needs_Repair = 'Needs_Repair'
}

export enum DeliveryType {
  Home_Delivery = 'Home_Delivery',
  Pickup = 'Pickup',
  Both = 'Both'
}

export enum PostStatus {
  active = 'active',
  inactive = 'inactive',
  sold = 'sold',
  deleted = 'deleted'
}

// 帖子图片类型
export interface PostImages {
  FRONT: string;
  SIDE?: string;
  BACK?: string;
  DAMAGE?: string;
}

// 帖子价格类型
export interface PostPrice {
  amount?: number;
  isFree: boolean;
  isNegotiable: boolean;
}

// 帖子类型
export interface Post {
  id: string;
  category: PostCategory;
  title: string;
  description: string;
  condition: PostCondition;
  images: PostImages;
  price: PostPrice;
  deliveryType: DeliveryType;
  poster: User;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

// 帖子过滤条件输入
export interface PostFilterInput {
  category?: PostCategory;
  condition?: PostCondition;
  priceRange?: string;
  status?: PostStatus;
}

// 创建帖子输入
export interface CreatePostInput {
  category: PostCategory;
  title: string;
  description: string;
  condition: PostCondition;
  images: PostImages;
  price: PostPrice;
  deliveryType: DeliveryType;
}

// 更新帖子输入
export interface UpdatePostInput {
  category?: PostCategory;
  title?: string;
  description?: string;
  condition?: PostCondition;
  images?: PostImages;
  price?: PostPrice;
  deliveryType?: DeliveryType;
  status?: PostStatus;
}

// 帖子响应类型
export type PostResponse = GraphQLBaseResponse<Post>;

// 帖子列表响应类型
export type PostListResponse = GraphQLBaseResponse<Post[]>;