export interface PostPrice {
  amount: string;
  isFree: boolean;
  isNegotiable: boolean;
}

export interface PostImages {
  [key: string]: string | undefined;
}

export interface BasePost {
  category: string;
  title: string;
  description: string;
  condition: string;
  images: PostImages;
  price: PostPrice;
  delivery: string;
}

export type CreatePostRequest = BasePost

export interface Post extends BasePost {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  poster: {_id:string};
  status:string;
} 