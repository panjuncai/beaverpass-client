import { User } from './user';
import { GraphQLBaseResponse } from './api';

export enum DeliveryType {
  homeDelivery = 'homeDelivery',
  pickup = 'pickup',
  both = 'both',
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
  category: string;
  title: string;
  description: string;
  condition: string;
  images: PostImages;
  price: PostPrice;
  deliveryType: string;
  poster: User;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

// 帖子过滤条件输入
export interface PostFilterInput {
  category?: string;
  condition?: string;
  priceRange?: string;
  status?: PostStatus;
}

// 创建帖子输入
export interface CreatePostInput {
  category: string;
  title: string;
  description: string;
  condition: string;
  images: PostImages;
  price: PostPrice;
  deliveryType: string;
}

// 更新帖子输入
export interface UpdatePostInput {
  category?: string;
  title?: string;
  description?: string;
  condition?: string;
  images?: PostImages;
  price?: PostPrice;
  deliveryType?: string;
  status?: PostStatus;
}

// 帖子响应类型
export type PostResponse = GraphQLBaseResponse<Post>;

// 帖子列表响应类型
export type PostListResponse = GraphQLBaseResponse<Post[]>;