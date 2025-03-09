// REST API 响应接口
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// GraphQL 基础响应接口
export interface GraphQLBaseResponse<T = unknown> {
  code: number;
  msg: string;
  data?: T;
} 