import { Toast } from "antd-mobile";
import axios from "axios";

const API_URI = import.meta.env.VITE_API_URI as string;
const apiClient = axios.create({
  baseURL: API_URI, // 替换为实际后端 URL
  timeout: 10000, // 请求超时时间
  withCredentials: true, // 添加这行来支持跨域凭证
});

// 不需要显示认证错误的路径
const publicPaths = ['/login', '/register', '/auth/callback'];

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token 并添加到请求头
    const token = localStorage.getItem('supabase_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // console.log(`Axios Request Error:${JSON.stringify(error)}`);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // console.log(`Axios Response:${JSON.stringify(response)}`)
    const { code, msg, data } = response.data;
    if (code !== 0) {
      // 检查当前路径是否是公共路径
      const isPublicPath = publicPaths.includes(window.location.pathname);
      
      // 在公共路径上不显示错误提示
      if (!isPublicPath) {
        Toast.show({ icon: "fail", content: msg, duration: 2000 });
      }
      
      // 手动抛出业务错误
      return Promise.reject(new Error(msg || "Unknown Error"));
    }
    return data;
  },
  (error) => {
    // 检查当前路径是否是公共路径
    const isPublicPath = publicPaths.includes(window.location.pathname);
    
    // console.log(`Axios Response Error:${JSON.stringify(error)}`);
    // console.log(`error response is ${JSON.stringify(error.response)}`)
    if (error.response?.data.code === 4001) {
      // 未授权，可能是 token 过期
      localStorage.removeItem('supabase_token');
      
      // 如果不在登录页面，则重定向到登录页面
      if (!isPublicPath) {
        window.location.href = '/login';
      }
    } else {
      // 在公共路径上不显示错误提示
      if (!isPublicPath) {
        Toast.show({
          icon: "fail",
          content: error.response?.data?.msg || "Network Error",
          duration: 4000,
        });
      }
      
      // 捕获 HTTP 错误
      return Promise.reject(new Error(error.response?.data?.msg || "Network Error"));
    }
  }
);

export default apiClient;
