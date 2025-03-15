import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { Toast } from 'antd-mobile';

// 获取 API 地址
const API_URI = import.meta.env.VITE_API_GRAPHQL_URI as string;

// 不需要显示认证错误的路径
const publicPaths = ['/login', '/register', '/auth/callback'];

// 创建 HTTP 链接
const httpLink = createHttpLink({
  uri: API_URI,
  credentials: 'include', // 包含凭证（cookies）
});

// 添加认证头链接
const authLink = setContext((_, { headers }: { headers?: Record<string, string> }) => {
  // 从 localStorage 获取 token
  const token = localStorage.getItem('supabase_token');
  
  // 返回带有 token 的头信息
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// 错误处理链接
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // 检查当前路径是否是公共路径
  const isPublicPath = publicPaths.includes(window.location.pathname);
  
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${String(path)}`
      );
      
      // 处理认证错误
      if (message.includes('not authenticated') || message.includes('unauthorized')) {
        localStorage.removeItem('supabase_token');
        
        // 如果不在登录页面，则重定向到登录页面
        if (!isPublicPath) {
          window.location.href = '/login';
        }
        return;
      }
      
      // 在公共路径上不显示错误提示
      if (isPublicPath) {
        return;
      }
      
      Toast.show({
        icon: 'fail',
        content: message,
        duration: 2000,
      });
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // 在公共路径上不显示网络错误提示
    if (isPublicPath) {
      return;
    }
    
    Toast.show({
      icon: 'fail',
      content: 'Network error, please check your connection',
      duration: 2000,
    });
  }
});

// 创建 Apollo 客户端
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;