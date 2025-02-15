import { AxiosBaseQueryError } from "@/api/axiosBaseQuery";
import CenteredLoading from "@/components/CenterLoading";
import { useGetProductsQuery } from "@/services/productApi";
import { HeartFill, HeartOutline } from "antd-mobile-icons";
import { showToast } from "@/store/slices/toastSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";

const Search: React.FC = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [search, setSearch] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]|undefined>([]);
  const dispatch = useDispatch<AppDispatch>();

  // 添加类型检查函数
  function isAxiosError(error: any): error is AxiosBaseQueryError {
    return "status" in error && "data" in error;
  }
  useEffect(()=>{
    if(search){
      setFilteredProducts(products?.filter((product)=>product.title.toLowerCase().includes(search.toLowerCase())));
    }else{
      setFilteredProducts(products);
    }
  },[search,products]);
  //只在组件挂载时显示一次测试 toast
  useEffect(() => {
    dispatch(
      showToast({ message: "Loading Success", type: "success", duration: 1000 })
    );
  }, [dispatch]);

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
  }, [error, dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // console.log(e.target.value);
  };

  return (
    <>
      {isLoading ? (
        <CenteredLoading />
      ) : (
        <div className="container grid grid-cols-1 gap-0 p-4">
          <label className="input input-bordered flex items-center gap-2 ml-4 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            <input type="text" className="grow" placeholder="Search" onChange={handleSearch}/>
          </label>
          <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts?.map((product, index) => (
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
                  <p>${product.price}</p>
                  <button className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center">
                    {index % 2 === 0 ? (
                      <HeartOutline fontSize={24} />
                    ) : (
                      <HeartFill color="#BED596" fontSize={24} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
