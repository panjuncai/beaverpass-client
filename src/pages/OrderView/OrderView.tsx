import CustomNavBar from "@/components/CustomNavBar/CustomNavBar";
import { useAuth } from "@/hooks/useAuth";
import { useGetPostQuery } from "@/services/postApi";
import { useCreateOrderMutation } from "@/services/orderApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Toast } from "antd-mobile";
import CenteredLoading from "@/components/CenterLoading";

interface LocationState {
  productId: string;
}

interface ShippingInfo {
  address: string;
  receiver: string;
  phone: string;
}

const OrderView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = (location.state as LocationState)?.productId;
  const { data: post, isLoading: isLoadingPost } = useGetPostQuery(productId);
  const { loginUser } = useAuth();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: "",
    receiver: `${loginUser?.firstName} ${loginUser?.lastName}`,
    phone: "",
  });

  if (isLoadingPost) {
    return <CenteredLoading />;
  }

  const calculateFees = () => {
    const baseAmount = Number(post?.price?.amount || 0);
    const deliveryFee = post?.delivery === "Home Delivery" ? 10 : 0;
    const serviceFee = post?.price?.isFree ? 10 : 0;
    const tax = baseAmount * 0.13;
    const paymentFee = (baseAmount + deliveryFee + serviceFee + tax) * 0.029 + 0.30; // 假设支付处理费为2.9% + $0.30
    const total = baseAmount + deliveryFee + serviceFee + tax + paymentFee;

    return {
      amount: baseAmount,
      deliveryFee,
      serviceFee,
      tax,
      paymentFee,
      total
    };
  };

  const handleCreateOrder = async () => {
    if (!post || !loginUser) return;

    const fees = calculateFees();
   
      const orderData = {
        buyerId: { _id: loginUser._id },
        sellerId: { _id: post.poster._id },
        postSnapshot: {
          postId: post._id,
          title: post.title,
          price: Number(post.price.amount),
          images: {
            FRONT: post.images.FRONT || '',
            BACK: post.images.BACK || '',
            LEFT: post.images.LEFT || '',
            RIGHT: post.images.RIGHT || ''
          }
        },
        ...fees,
        shippingInfo,
      };

      await createOrder(orderData).unwrap();
      Toast.show({
        icon: "success",
        content: "Order created successfully",
      });
      void navigate("/deals");
    
  };

  const fees = calculateFees();

  return (
    <>
      <CustomNavBar title="Order View" />
      <div className="p-4 space-y-6">
        {/* 商品信息 */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">{post?.title}</h2>
            <img 
                src={post?.images.FRONT} 
                alt={post?.title} 
                className="w-full h-36 object-cover"
              />
            <p>{post?.description}</p>
            <div className="badge badge-outline">{post?.condition}</div>
          </div>
        </div>

        {/* 配送信息 */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Shipping Information</h2>
            <input
              type="text"
              placeholder="Address"
              className="input input-bordered w-full"
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Phone"
              className="input input-bordered w-full"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>

        {/* 费用明细 */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Price:</span>
                <span>${fees.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>${fees.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee:</span>
                <span>${fees.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (HST 13%):</span>
                <span>${fees.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Processing Fee:</span>
                <span>${fees.paymentFee.toFixed(2)}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${fees.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 支付按钮 */}
        <div className="fixed bottom-12 left-0 right-0 flex justify-center">
          <button
            className="btn btn-primary btn-xl w-4/5 rounded-full shadow-md"
            onClick={() => void handleCreateOrder()}
            disabled={isCreatingOrder}
          >
            {isCreatingOrder ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderView;