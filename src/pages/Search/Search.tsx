import CenteredLoading from "@/components/CenterLoading";
import { useGetPostsQuery } from "@/services/postApi";
import { HeartOutline } from "antd-mobile-icons";
import { useEffect, useState, useMemo } from "react";
import { Post, PostStatus } from "@/types/post";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AddressModal from "@/components/AddressModal/AddressModal";

const Search: React.FC = () => {
  const { loginUser, isLoading: isLoadingAuth, isAuthenticated } = useAuth();
  const { data: posts, isLoading } = useGetPostsQuery();
  const [search, setSearch] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [address, setAddress] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const navigate = useNavigate();

  const activePosts = useMemo(
    () => posts?.filter((post) => post.status === PostStatus.ACTIVE) || [],
    [posts]
  );

  useEffect(() => {
    if (!activePosts) return;
    
    // 先按搜索词过滤
    let filtered = search
      ? activePosts.filter((post) =>
          post.title.toLowerCase().includes(search.toLowerCase())
        )
      : activePosts;
    
    // 再按分类过滤
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (post.description && post.description.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }
    
    setFilteredPosts(filtered);
  }, [search, activePosts, selectedCategory]);

  useEffect(() => {
    if (loginUser) {
      setAddress(loginUser.address ?? "Please select your address");
    }
  }, [loginUser]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  const handleAddressSelect = (address: string) => {
    setAddress(address);
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  if (isLoadingAuth) return <CenteredLoading />;

  return (
    <>
      {isLoading ? (
        <CenteredLoading />
      ) : (
        // 搜索框
        <div className="grid grid-cols-1 gap-0 p-2">
          {isAuthenticated && (
            <div
              className="flex items-center justify-center p-2"
              onClick={() => setIsAddressModalOpen(true)}
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
              >
                <rect width="256" height="256" fill="none" />
                <circle
                  cx="128"
                  cy="104"
                  r="32"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <path
                  d="M208,104c0,72-80,128-80,128S48,176,48,104a80,80,0,0,1,160,0Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
              </svg>
              <div className="flex-1 text-xm font-bold">{address}</div>
            </div>
          )}
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
            <input
              type="text"
              className="grow"
              placeholder="Search"
              onChange={handleSearch}
            />
          </label>
          {/* 分类选择 - 带横向滚动 */}
          <div className="overflow-x-auto p-2 ml-2 mr-2">
            <div className="flex gap-2 min-w-max">
              <button 
                className={`btn ${selectedCategory === "All" ? "btn-primary" : "btn-outline text-gray-400"}`}
                onClick={() => handleCategorySelect("All")}
              >
                All
              </button>
              <button 
                className={`btn ${selectedCategory === "Bed" ? "btn-primary" : "btn-outline text-gray-400"}`}
                onClick={() => handleCategorySelect("Bed")}
              >
                Beds
              </button>
              <button 
                className={`btn ${selectedCategory === "Desk" ? "btn-primary" : "btn-outline text-gray-400"}`}
                onClick={() => handleCategorySelect("Desk")}
              >
                Desks
              </button>
              <button 
                className={`btn ${selectedCategory === "Chair" ? "btn-primary" : "btn-outline text-gray-400"}`}
                onClick={() => handleCategorySelect("Chair")}
              >
                Chairs
              </button>
              <button 
                className={`btn ${selectedCategory === "Table" ? "btn-primary" : "btn-outline text-gray-400"}`}
                onClick={() => handleCategorySelect("Table")}
              >
                Tables
              </button>
              <button 
                className={`btn ${selectedCategory === "Sofa" ? "btn-primary" : "btn-outline text-gray-400"}`}
                onClick={() => handleCategorySelect("Sofa")}
              >
                Sofas
              </button>
              <button 
                className={`btn ${selectedCategory === "Storage" ? "btn-primary" : "btn-outline text-gray-400"}`}
                onClick={() => handleCategorySelect("Storage")}
              >
                Storage
              </button>
              <button 
                className={`btn ${selectedCategory === "Other" ? "btn-primary" : "btn-outline text-gray-400"}`}
                onClick={() => handleCategorySelect("Other")}
              >
                Other
              </button>
            </div>
          </div>
          {/* 商品列表 */}
          <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-4">
            {filteredPosts?.map((post) => (
              <div key={post._id} className="card bg-base-100 shadow-md">
                <figure
                  onClick={() => {
                    void navigate(`/posts/${post._id}`);
                  }}
                >
                  <img
                    className="h-44 w-full"
                    src={post.images.FRONT || ""}
                    alt={post.title}
                  />
                </figure>
                <div
                  className="card-body"
                  style={{ "--padding-card": "0.5rem" } as React.CSSProperties}
                >
                  <h2 className="card-title">{post.title}</h2>
                  <p>
                    ${post.price.isFree ? "Free" : post.price.amount}{" "}
                    <em>{post.price.isNegotiable ? "Negotiable" : ""}</em>
                  </p>
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
          <AddressModal
            key={isAddressModalOpen ? "open" : "closed"}
            isOpen={isAddressModalOpen}
            onClose={() => setIsAddressModalOpen(false)}
            onSelect={handleAddressSelect}
            initialAddress={address}
            isSave={true}
          />
        </div>
      )}
    </>
  );
};

export default Search;
