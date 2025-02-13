import { AxiosBaseQueryError } from "@/api/axiosBaseQuery";
import { useGetProductsQuery } from "@/services/productApi";

const Search: React.FC = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();
  if (isLoading) return <div>Loading...</div>;
  // 添加类型检查函数
  function isAxiosError(error: any): error is AxiosBaseQueryError {
    return "status" in error && "data" in error;
  }

  // 组件中使用
  if (error) {
    if (isAxiosError(error)) {
      return (
        <div>{`Error ${error.status}: ${JSON.stringify(error.data)}`}</div>
      );
    } else {
      return <div>{error.toString()}</div>;
    }
  }
  return (
    <div>
      <ul>
        {products?.map((i) => (
          <li key={i._id}>{i.title}</li>
        ))}
      </ul>
    </div>
  );
};
export default Search;
