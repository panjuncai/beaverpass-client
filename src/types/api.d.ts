export interface ApiResponse<T> {
    code: number; // 响应码
    msg: string;  // 响应消息
    data: T;      // 实际返回的数据
  }
  