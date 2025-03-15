import { User } from './user';

// 将枚举改为字符串常量
export const PostCategory = {
  LIVING_ROOM_FURNITURE: 'LIVING_ROOM_FURNITURE',
  BEDROOM_FURNITURE: 'BEDROOM_FURNITURE',
  DINING_ROOM_FURNITURE: 'DINING_ROOM_FURNITURE',
  OFFICE_FURNITURE: 'OFFICE_FURNITURE',
  OUTDOOR_FURNITURE: 'OUTDOOR_FURNITURE',
  STORAGE: 'STORAGE',
  OTHER: 'OTHER'
} as const;

export const PostCondition = {
  LIKE_NEW: 'LIKE_NEW',
  GENTLY_USED: 'GENTLY_USED',
  MINOR_SCRATCHES: 'MINOR_SCRATCHES',
  STAINS: 'STAINS',
  NEEDS_REPAIR: 'NEEDS_REPAIR'
} as const;

export const DeliveryType = {
  HOME_DELIVERY: 'HOME_DELIVERY',
  PICKUP: 'PICKUP',
  BOTH: 'BOTH'
} as const;

export const PostStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SOLD: 'SOLD',
  DELETED: 'DELETED'
} as const;

// 创建字符串字面量类型
export type PostCategory = typeof PostCategory[keyof typeof PostCategory];
export type PostCondition = typeof PostCondition[keyof typeof PostCondition];
export type DeliveryType = typeof DeliveryType[keyof typeof DeliveryType];
export type PostStatus = typeof PostStatus[keyof typeof PostStatus];

// 帖子图片类型
export interface PostImage {
  id: string;
  postId: string;
  imageUrl: string;
  imageType?: string;
  createdAt?: string;
}

// 帖子类型
export interface Post {
  id: string;
  category: PostCategory;
  title: string;
  description: string;
  condition: PostCondition;
  amount: number;
  isNegotiable?: boolean;
  deliveryType: DeliveryType;
  poster?: User;
  posterId?: string;
  status?: PostStatus;
  createdAt?: string;
  updatedAt?: string;
  images?: PostImage[];
}

// 帖子过滤条件输入
export interface PostFilterInput {
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  search?:string;
}

// 帖子图片输入
export interface PostImageInput {
  imageUrl: string;
  imageType?: string;
}

// 创建帖子输入
export interface CreatePostInput {
  category: string;
  title: string;
  description: string;
  condition: string;
  amount: number;
  isNegotiable?: boolean;
  deliveryType: string;
  images: PostImageInput[];
}

// 更新帖子输入
export interface UpdatePostInput {
  id: string;
  category?: string;
  title?: string;
  description?: string;
  condition?: string;
  amount?: number;
  isNegotiable?: boolean;
  deliveryType?: string;
  status?: string;
}

// 添加图片输入
export interface AddPostImageInput {
  postId: string;
  imageUrl: string;
  imageType?: string;
}

// 删除图片输入
export interface DeletePostImageInput {
  id: string;
}