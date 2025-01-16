import axios from 'axios';
const API_URI=import.meta.env.VITE_API_URI;
const apiClient = axios.create({
  baseURL: API_URI, // 替换为实际后端 URL
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
// apiClient.interceptors.request.use(
//   (config) => {
//     // 可在此添加请求头（如 Token）
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    const { code, msg, data } = response.data;
    if (code !== 0) {
      // 手动抛出业务错误
      return Promise.reject(new Error(msg || 'Unknown Error'));
    }
    return data;
  },
  (error) => {
    // 捕获 HTTP 错误
    return Promise.reject(error.response?.data?.msg || 'Network Error');
  }
);

export default apiClient;
