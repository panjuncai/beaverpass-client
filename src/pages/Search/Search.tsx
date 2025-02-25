import CenteredLoading from "@/components/CenterLoading";
import { useGetPostsQuery } from "@/services/postApi";
import { HeartOutline } from "antd-mobile-icons";
import { useEffect, useState, useMemo } from "react";
import { Post } from "@/types/post";
import { useNavigate } from "react-router-dom";

const Search: React.FC = () => {
  const { data:posts, isLoading } = useGetPostsQuery();
  const [search, setSearch] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  const activePosts = useMemo(() => 
    posts?.filter(post => post.status === 'active') || [], 
    [posts]
  );

  useEffect(() => {
    if (!activePosts) return;
    setFilteredPosts(
      search
        ? activePosts.filter(post => post.title.toLowerCase().includes(search.toLowerCase()))
        : activePosts
    );
  }, [search, activePosts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      {isLoading ? (
        <CenteredLoading />
      ) : (
        // 搜索框
        <div className="grid grid-cols-1 gap-0 p-2">
          <label className="input input-bordered input-lg flex items-center gap-2 ml-4 mr-4">
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
          {/* 商品列表 */}
          <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-4">
            {filteredPosts?.map((post) => (
              <div key={post._id} className="card bg-base-100 shadow-md">
                <figure onClick={()=>{void navigate(`/posts/${post._id}`)}}>
                  <img
                    className="h-44 w-full"
                    src={post.images.FRONT||''}
                    alt={post.title}
                  />
                </figure>
                <div
                  className="card-body"
                  style={{ "--padding-card": "0.5rem" } as React.CSSProperties}
                >
                  <h2 className="card-title">{post.title}</h2>
                  <p>${post.price.isFree?'Free':post.price.amount} <em>{post.price.isNegotiable?'Negotiable':''}</em></p>
                  <button className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center">
                    {/* {index % 2 === 0 ? (
                      <HeartOutline fontSize={24} />
                    ) : (
                      <HeartFill color="#BED596" fontSize={24} />
                    )} */}
                    <HeartOutline fontSize={24} />
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
