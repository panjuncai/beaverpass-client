import { Toast } from "antd-mobile";
import axios from "axios";
const API_URI = import.meta.env.VITE_API_URI;
const apiClient = axios.create({
  baseURL: API_URI, // 替换为实际后端 URL
  timeout: 5000, // 请求超时时间
  withCredentials: true, // 添加这行来支持跨域凭证
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可在此添加请求头（如 Token）
    // console.log(`Axios Request:${JSON.stringify(config)}`)
    return config;
  },
  (error) => {
    console.log(`Axios Request Error:${JSON.stringify(error)}`);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // console.log(`Axios Response:${JSON.stringify(response)}`)
    const { code, msg, data } = response.data;
    if (code !== 0) {
      Toast.show({ icon: "fail", content: msg, duration: 2000 });
      // console.log(`Error: ${msg}`);
      // 手动抛出业务错误
      return Promise.reject(new Error(msg || "Unknown Error"));
    }
    return data;
  },
  (error) => {
    // console.log(`Axios Response Error:${JSON.stringify(error)}`);
    // console.log(`error response is ${JSON.stringify(error.response)}`)
    if (error.response?.data.code === 4001) {
      // window.location.href = '/login';
      //console.log(`error response is ${JSON.stringify(error.response)}`);
    } else {
      Toast.show({
        icon: "fail",
        content: error.response?.data?.msg || "Network Error",
        duration: 4000,
      });
      // 捕获 HTTP 错误
      return Promise.reject(error.response?.data?.msg || "Network Error");
    }
  }
);

export default apiClient;
