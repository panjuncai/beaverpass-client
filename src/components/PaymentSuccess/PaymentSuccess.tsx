import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import CenteredLoading from '@/components/CenterLoading';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentIntent = searchParams.get('payment_intent');
        if (!paymentIntent) {
          throw new Error('No payment intent found');
        }

        // 这里可以调用后端 API 验证支付状态
        // const response = await verifyPaymentStatus(paymentIntent);
        
        Toast.show({
          icon: 'success',
          content: 'Payment successful!',
        });
        
        // 延迟2秒后跳转，让用户看到成功提示
        setTimeout(() => {
          void navigate('/deals', { replace: true });
        }, 2000);
      } catch (error) {
        Toast.show({
          icon: 'fail',
          content: 'Payment verification failed',
        });
        // 延迟2秒后跳转
        setTimeout(() => {
          void navigate('/deals', { replace: true });
        }, 2000);
      } finally {
        setIsVerifying(false);
      }
    };

    void verifyPayment();
  }, [searchParams, navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <CenteredLoading />
        <p className="mt-4 text-gray-600">Verifying payment result...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment successful</h2>
        <p className="text-gray-600">Your order has been paid</p>
        <p className="text-gray-400 text-sm mt-1">Redirecting to order page...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess; 