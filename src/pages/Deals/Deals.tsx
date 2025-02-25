/* eslint-disable react/prop-types */
import EmptyDeal from "@/components/Empty/EmptyDeal";
import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";
import { useGetOrdersQuery } from "@/services/orderApi";
import { useState } from "react";
import CenteredLoading from "@/components/CenterLoading";
import { Order } from "@/types/order";
import { useGetUserPostsQuery, useUpdatePostMutation } from "@/services/postApi";
import { Post } from "@/types/post";
import { Toast } from "antd-mobile";

type TabType = "buy" | "sell";
type PostStatus = "active" | "inactive" | "sold" | "deleted";

const Deals: React.FC = () => {
  const { isAuthenticated, loginUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("buy");
  const { data: orders, isLoading } = useGetOrdersQuery();
  const { data: posts, isLoading: isPostLoading } = useGetUserPostsQuery(undefined, {
    skip: !loginUser?._id,
    refetchOnMountOrArgChange: true
  });
  const [buyTabState, setBuyTabState] = useState<'active' | 'history'>('active');
  const [sellTabState, setSellTabState] = useState<'active' | 'inactive' |'sold' |'deleted'>('active');

  const getFilteredOrders = (type: TabType): Order[] => {
    if (!orders) return [];
    switch (type) {
      case "buy":
        return orders.filter((order) => order.buyerId._id === loginUser?._id);
      case "sell":
        return orders.filter((order) => order.sellerId._id === loginUser?._id);
      default:
        return [];
    }
  };

  const getFilteredPosts = (type: PostStatus): Post[] => {
    if (!posts) return [];
    switch (type) {
      case "active":
        return posts.filter((post) => post.status === 'active');
      case "inactive":
        return posts.filter((post) => post.status === 'inactive');
      case "sold":
        return posts.filter((post) => post.status === 'sold');
      case "deleted":
        return posts.filter((post) => post.status === 'deleted');
      default:
        return [];
    }
  };
  
  const isActiveOrder = (status: string) => {
    return ['pending_payment', 'paid', 'shipped'].includes(status);
  };

  const isHistoryOrder = (status: string) => {
    return ['completed', 'canceled', 'refunded'].includes(status);
  };

  // eslint-disable-next-line react/prop-types
  const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="card bg-base-100 shadow-md mb-4">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <img
            src={order.postSnapshot.images.FRONT}
            alt={order.postSnapshot.title}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="card-title">{order.postSnapshot.title}</h3>
            <div className="badge badge-outline">{order.status}</div>
            <p className="text-xl font-bold mt-2">${order.total.toFixed(2)}</p>
          </div>
        </div>
        <div className="divider my-2"></div>
        <div className="flex justify-between text-sm">
          <span>
            Order Date: {new Date(order.createdAt).toLocaleDateString()}
          </span>
          <span
            className={
              order.buyerId._id === loginUser?._id
                ? "text-primary"
                : "text-success"
            }
          >
            {order.buyerId._id === loginUser?._id ? "Buying" : "Selling"}
          </span>
        </div>
      </div>
    </div>
  );

  const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const [updatePost] = useUpdatePostMutation();

    const handleStatusChange = async (newStatus: string) => {
      try {
        await updatePost({ postId: post._id, status: newStatus }).unwrap();
        Toast.show({
          icon: 'success',
          content: 'Post status updated'
        });
      } catch(error) {
        console.log('update post statuserror',error);
        Toast.show({
          icon: 'fail',
          content: 'Failed to update post status'
        });
      }
    };

    return (
      <div className="card bg-base-100 shadow-md mb-4">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <img
              src={post.images.FRONT || ''}
              alt={post.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="card-title">{post.title}</h3>
              <div className="badge badge-outline">{post.status}</div>
              <p className="text-xl font-bold mt-2">
                ${post.price.isFree ? 'Free' : post.price.amount}
                {post.price.isNegotiable && <span className="text-sm ml-2">Negotiable</span>}
              </p>
            </div>
          </div>
          <div className="divider my-2"></div>
          <div className="flex justify-between items-center text-sm">
            <span>Posted: {new Date(post.createdAt || '').toLocaleDateString()}</span>
            <div className="flex gap-2">
              {post.status === 'active' ? (
                <>
                  <button 
                    className="btn btn-sm btn-warning"
                    onClick={() => void handleStatusChange('inactive')}
                  >
                    Deactivate
                  </button>
                  <button 
                    className="btn btn-sm btn-error"
                    onClick={() => void handleStatusChange('deleted')}
                  >
                    Delete
                  </button>
                </>
              ) : post.status === 'inactive' ? (
                <>
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => void handleStatusChange('active')}
                  >
                    Activate
                  </button>
                  <button 
                    className="btn btn-sm btn-error"
                    onClick={() => void handleStatusChange('deleted')}
                  >
                    Delete
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DealsFunc = () => {
    if (isLoading || isPostLoading) return <CenteredLoading />;

    const filteredOrders = getFilteredOrders(activeTab);
    const activeOrders = filteredOrders.filter(order => isActiveOrder(order.status));
    const historyOrders = filteredOrders.filter(order => isHistoryOrder(order.status));

    const filteredPosts = getFilteredPosts(sellTabState);

    return (
      <div className="flex-1">
        <div role="tablist" className="tabs tabs-bordered grid grid-cols-2">
          <input
            type="radio"
            name="tabs_1"
            role="tab"
            className="tab text-primary font-bold text-xl"
            aria-label="Buy"
            checked={activeTab === "buy"}
            onChange={() => setActiveTab("buy")}
          />
          <div role="tabpanel" className="tab-content p-4 col-span-2">
            <div role="tablist" className="tabs tabs-boxed bg-base-100 grid grid-cols-2">
              <input
                type="radio"
                name="tabs_buy"
                role="tab"
                className="tab flex-1 text-xl"
                aria-label="Active Orders"
                checked={buyTabState === 'active'}
                onChange={() => setBuyTabState('active')}
              />
              <div
                role="tabpanel"
                className="tab-content rounded-box p-6 w-full"
              >
                {activeOrders.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <EmptyDeal />
                  </div>
                ) : (
                  activeOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))
                )}
              </div>

              <input
                type="radio"
                name="tabs_buy"
                role="tab"
                className="tab flex-1 text-xl"
                aria-label="History"
                checked={buyTabState === 'history'}
                onChange={() => setBuyTabState('history')}
              />
              <div
                role="tabpanel"
                className="tab-content rounded-box p-6 w-full"
              >
                {historyOrders.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <EmptyDeal />
                  </div>
                ) : (
                  historyOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))
                )}
              </div>
            </div>
          </div>
          <input
            type="radio"
            name="tabs_1"
            role="tab"
            className="tab text-primary font-bold text-xl"
            aria-label="Sell"
            checked={activeTab === "sell"}
            onChange={() => setActiveTab("sell")}
          />
          <div role="tabpanel" className="tab-content p-4 col-span-3">
            <div role="tablist" className="tabs tabs-boxed bg-base-100 grid grid-cols-3">
              <input
                type="radio"
                name="tabs_sell"
                role="tab"
                className="tab flex-1 text-xl"
                aria-label="Active"
                checked={sellTabState === 'active'}
                onChange={() => setSellTabState('active')}
              />
              <div
                role="tabpanel"
                className="tab-content rounded-box p-6 w-full"
              >
                {filteredPosts.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <EmptyDeal />
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                )}
              </div>

              <input
                type="radio"
                name="tabs_sell"
                role="tab"
                className="tab flex-1 text-xl"
                aria-label="Inactive"
                checked={sellTabState === 'inactive'}
                onChange={() => setSellTabState('inactive')}
              />
              <div
                role="tabpanel"
                className="tab-content rounded-box p-6 w-full"
              >
                {filteredPosts.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <EmptyDeal />
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                )}
              </div>
              <input
                type="radio"
                name="tabs_sell"
                role="tab"
                className="tab flex-1 text-xl"
                aria-label="Sold"
                checked={sellTabState === 'sold'}
                onChange={() => setSellTabState('sold')}
              />
              <div
                role="tabpanel"
                className="tab-content rounded-box p-6 w-full"
              >
                {filteredPosts.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <EmptyDeal />
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {isAuthenticated ? (
        <DealsFunc />
      ) : (
        <div className="flex flex-col h-full justify-center">
          <LoginCard />
        </div>
      )}
    </div>
  );
};

export default Deals;
