/* eslint-disable react/prop-types */
import EmptyDeal from "@/components/Empty/EmptyDeal";
import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";
import { useGetOrdersQuery } from "@/services/orderApi";
import { useState } from "react";
import CenteredLoading from "@/components/CenterLoading";
import { Order } from "@/types/order";
import CustomNavBar from "@/components/CustomNavBar/CustomNavBar";

type TabType = "all" | "buy" | "sell";

const Deals: React.FC = () => {
  const { isAuthenticated, loginUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const { data: orders, isLoading } = useGetOrdersQuery();

  const getFilteredOrders = (type: TabType): Order[] => {
    if (!orders) return [];
    switch (type) {
      case "buy":
        return orders.filter((order) => order.buyerId._id === loginUser?._id);
      case "sell":
        return orders.filter((order) => order.sellerId._id === loginUser?._id);
      default:
        return orders.filter(
          (order) =>
            order.buyerId._id === loginUser?._id ||
            order.sellerId._id === loginUser?._id
        );
    }
  };

  // eslint-disable-next-line react/prop-types
  const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="card bg-base-100 shadow-md mb-4">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <img
            src={order.postSnapshot.images[0]}
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

  const DealsFunc = () => {
    if (isLoading) return <CenteredLoading />;

    const filteredOrders = getFilteredOrders(activeTab);

    return (
      <div className="flex-1">
        <div role="tablist" className="tabs tabs-bordered grid grid-cols-3">
          <input
            type="radio"
            name="tabs_1"
            role="tab"
            className="tab text-primary font-bold text-xl"
            aria-label="All"
            checked={activeTab === "all"}
            onChange={() => setActiveTab("all")}
          />
          <div role="tabpanel" className="tab-content p-4 col-span-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <EmptyDeal />
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))
            )}
          </div>
          <input
            type="radio"
            name="tabs_1"
            role="tab"
            className="tab text-primary font-bold text-xl"
            aria-label="Buy"
            checked={activeTab === "buy"}
            onChange={() => setActiveTab("buy")}
          />
          <div role="tabpanel" className="tab-content p-4 col-span-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <EmptyDeal />
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))
            )}
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
            {filteredOrders.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <EmptyDeal />
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <CustomNavBar title="Deals" showBack={false} />
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
