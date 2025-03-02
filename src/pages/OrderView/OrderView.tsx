import { useAuth } from "@/hooks/useAuth";
import { useGetPostQuery } from "@/services/postApi";
import { useCreateOrderMutation } from "@/services/orderApi";
import { useCreatePaymentIntentMutation } from "@/services/paymentApi";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toast } from "antd-mobile";
import CenteredLoading from "@/components/CenterLoading";
import { DeliveryType } from "@/types/post";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/PaymentForm/PaymentForm";

// 替换为您的 Stripe 公钥
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface LocationState {
  productId: string;
}

interface ShippingInfo {
  address: string;
  receiver: string;
  phone: string;
}

const OrderView: React.FC = () => {
  const { loginUser, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const productId = (location.state as LocationState)?.productId;
  const { data: post, isLoading: isLoadingPost } = useGetPostQuery(productId, { skip: !productId });
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState<string>("");
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: "",
    receiver: `${loginUser?.firstName} ${loginUser?.lastName}`,
    phone: "",
  });

  useEffect(() => {
    if (!loginUser?._id) return;
    setShippingInfo({
      address: loginUser.address || "",
      receiver: `${loginUser?.firstName} ${loginUser?.lastName}`,
      phone: loginUser.phone || "",
    });
  }, [loginUser]);

  if(!isAuthenticated) return <Navigate to="/login" replace />;
  if(!productId) return <Navigate to="/search" replace />;
  if (isLoadingPost) {
    return <CenteredLoading />;
  }

  const calculateFees = () => {
    const baseAmount = Number(post?.price?.amount || 0);
    const deliveryFee = post?.deliveryType === DeliveryType.HOME_DELIVERY ? 10 : 0;
    const serviceFee = post?.price?.isFree ? 10 : 0;
    const tax = baseAmount * 0.13;
    const paymentFee = (baseAmount + deliveryFee + serviceFee + tax) * 0.029 + 0.30;
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
   
    try {
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
            LEFT: post.images.SIDE || '',
            RIGHT: post.images.DAMAGE || ''
          }
        },
        ...fees,
        shippingInfo,
      };

      const order = await createOrder(orderData).unwrap();
      
      // 创建支付意向
      const { clientSecret } = await createPaymentIntent({
        orderId: order._id
      }).unwrap();
      console.log('clientSecret', clientSecret);
      
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Error creating order:', error);
      Toast.show({
        icon: 'fail',
        content: 'Create order failed',
      });
    }
  };

  const handlePaymentSuccess = () => {
    Toast.show({
      icon: 'success',
      content: 'Payment successful!',
    });
    void navigate("/deals", { replace: true });
  };

  const handlePaymentError = (error: string) => {
    Toast.show({
      icon: 'fail',
      content: error,
    });
  };

  const handleClosePayment = () => {
    setClientSecret("");
  };

  const fees = calculateFees();

  return (
    <>
      <div className="p-4 space-y-6">
        {/* 商品信息 */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">{post?.title}</h2>
            <img 
              src={post?.images.FRONT||''} 
              alt={post?.title} 
              className="w-full h-36 object-cover rounded-lg"
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

        <div className="fixed bottom-12 left-0 right-0 flex justify-center">
          <button
            className="btn btn-primary btn-xl w-4/5 rounded-full shadow-md"
            onClick={() => void handleCreateOrder()}
            disabled={isCreatingOrder}
          >
            {isCreatingOrder ? "Processing..." : "Confirm Order"}
          </button>
        </div>

        {/* Stripe 支付模态框 */}
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              amount={fees.total}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onClose={handleClosePayment}
            />
          </Elements>
        )}

        <div className="h-20"></div>
      </div>
    </>
  );
};

export default OrderView;