import { AxiosBaseQueryError } from "@/api/axiosBaseQuery";
import CenteredLoading from "@/components/CenterLoading";
import { useGetProductsQuery } from "@/services/productApi";
import { HeartOutline } from "antd-mobile-icons";
import { showToast } from "@/store/slices/toastSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useEffect } from "react";

const Search: React.FC = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const dispatch = useDispatch<AppDispatch>();

  if (isLoading) return <CenteredLoading />;
  // 添加类型检查函数
  function isAxiosError(error: any): error is AxiosBaseQueryError {
    return "status" in error && "data" in error;
  }

  useEffect(() => {
    if (error) {
      if (isAxiosError(error)) {
        dispatch(
          showToast({
            message: `Error: ${error.status}: ${JSON.stringify(error.data)}`,
            type: "error",
            duration: 4000,
          })
        );
      } else {
        dispatch(
          showToast({
            message: `Error: ${error.message}`,
            type: "error",
            duration: 4000,
          })
        );
      }
    }
    if (true) {
      dispatch(
        showToast({ message: "This is a test", type: "success", duration: 4000 })
      );
    }
  },[error]);

  
  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
        {products?.map((product) => (
          <div key={product._id} className="card bg-base-100 shadow-xl">
            <figure>
              <img
                className="h-44 w-full"
                src={product.images?.[0]}
                alt={product.title}
              />
            </figure>
            <div
              className="card-body"
              style={{ "--padding-card": "0.5rem" } as React.CSSProperties}
            >
              <h2 className="card-title">{product.title}</h2>
              <p>{product.description}</p>
              <button className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center">
                
                <HeartOutline fontSize={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Search;
