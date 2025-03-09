import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Toast } from 'antd-mobile';

// 获取 API 地址
const API_URI = import.meta.env.VITE_API_GRAPHQL_URI as string;

// 创建 HTTP 链接
const httpLink = createHttpLink({
  uri: API_URI,
  credentials: 'include', // 包含凭证（cookies）
});

// 错误处理链接
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${String(path)}`
      );
      Toast.show({
        icon: 'fail',
        content: message,
        duration: 2000,
      });
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    Toast.show({
      icon: 'fail',
      content: 'Network error, please check your connection',
      duration: 2000,
    });
  }
});

// 创建 Apollo 客户端
const client = new ApolloClient({
  link: from([errorLink, httpLink]),
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