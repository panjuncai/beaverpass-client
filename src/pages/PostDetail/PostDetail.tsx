import CenteredLoading from "@/components/CenterLoading";
import CustomNavBar from "@/components/CustomNavBar/CustomNavBar";
import StarRating from "@/components/StarRating/StarRating";
import { useGetPostQuery } from "@/services/postApi";
import { useGetUserQuery } from "@/services/userApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateChatRoomMutation, useSendMessageMutation, useGetRoomWithUserQuery } from "@/services/chatApi";
import { useAuth } from "@/hooks/useAuth";
import { Toast } from "antd-mobile";

// eslint-disable-next-line react/prop-types
const PostDetail: React.FC<{ postId: string }> = ({ postId }) => {
  const { loginUser } = useAuth();
  const [createChatRoom] = useCreateChatRoomMutation();
  const [sendMessage] = useSendMessageMutation();
  const navigate = useNavigate();
  const { data: post, isLoading: isLoadingPost } =
    useGetPostQuery(postId);
  const { data: seller, isLoading: isLoadingSeller } = useGetUserQuery(
    post?.poster?._id ?? '',
    {
      skip: !post?.poster?._id,
    }
  );
  const sellerId = post?.poster._id || '';
  const { data: existingRoom } = useGetRoomWithUserQuery(sellerId, {
    skip: !sellerId  // 当没有 sellerId 时跳过查询
  });
  useEffect(()=>{
    // console.log(post?.poster?._id);
  },[post?.poster]);

  const handleChatClick = async () => {
    if (!loginUser) {
      Toast.show({
        content: 'Please login first',
        icon: 'fail'
      });
      void navigate('/login');
      return;
    }

    try {
      if (existingRoom) {
        // 先发送商品
        await sendMessage({
          roomId: existingRoom._id,
          postId: post?._id,
          messageType: 'post'
        }).unwrap();

        // 如果已有聊天室，直接跳转
        void navigate(`/chat/${existingRoom._id}`,{
          state:{
            chatRoom: existingRoom
          }
        });
      } else {
        // 创建新聊天室并发送商品消息
        const room = await createChatRoom({
          sellerId: sellerId
        }).unwrap();

        await sendMessage({
          roomId: room._id,
          postId: post?._id,
          messageType: 'post'
        }).unwrap();
        
        void navigate(`/chat/${room._id}`,{
          state:{
            chatRoom: room
          }
        });
      }
    } catch (error) {
      console.log('error', error);
      Toast.show({
        content: 'Failed to create chat',
        icon: 'fail'
      });
    }
  };

  return (
    <>
      {isLoadingPost || isLoadingSeller ? (
        <CenteredLoading />
      ) : (
        <div className="relative">
          {/* 页头返回 */}
          <CustomNavBar title={post?.title ? post?.title : "Detail"} />
          <div className="pl-4 pr-4 pb-24">
            {/* 跑马灯 */}
            <div className="carousel w-full h-60 rounded-xl">
              {post?.images && Object.entries(post.images)
                .filter(([, url]) => url !== null)
                .map(([key, url]) => (
                  <div key={key} id={key} className="carousel-item w-full">
                    <img src={url as string} className="w-full" alt={key} />
                  </div>
                ))}
            </div>
            <div className="flex w-full justify-center gap-2 py-2">
              {post?.images && Object.entries(post.images)
                .filter(([, url]) => url !== null)
                .map(([key], index) => (
                  <a key={key} href={`#${key}`} className="btn btn-xs">
                    {index + 1}
                  </a>
                ))}
            </div>
            {/* 商品说明 */}
            <div className="shadow-sm p-2">
              <div className="flex justify-between">
                <div className="text-2xl font-bold">
                  {post?.price.isFree ?"Free":"$" + post?.price.amount} <em>{post?.price.isNegotiable ? "Negotiable":""}</em>
                </div>
                <div className="text-sm text-green-600 text-center">
                  <div>New $350</div>
                  <div className="badge badge-success text-white">Like New</div>
                </div>
              </div>

              <p className="text-2xl mt-1 text-gray-700">
                {post?.description}
              </p>
            </div>
            {/* 卖家展示 */}
            <div className="mt-4 flex gap-4 shadow-sm p-2">
              <div className="avatar">
                <div className="w-[80px] rounded-xl">
                  <img
                    src={
                      seller?.avatar
                        ? "/avators/" + seller?.avatar + ".png"
                        : "/avators/1.png"
                    }
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex gap-2 items-center">
                  <span className="text-lg font-bold">{seller?.firstName}</span>
                  <span className="text-lg font-bold">{seller?.lastName}</span>
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                      className="w-6 h-6"
                    >
                      <path
                        d="M54.46,201.54c-9.2-9.2-3.1-28.53-7.78-39.85C41.82,150,24,140.5,24,128s17.82-22,22.68-33.69C51.36,83,45.26,63.66,54.46,54.46S83,51.36,94.31,46.68C106.05,41.82,115.5,24,128,24S150,41.82,161.69,46.68c11.32,4.68,30.65-1.42,39.85,7.78s3.1,28.53,7.78,39.85C214.18,106.05,232,115.5,232,128S214.18,150,209.32,161.69c-4.68,11.32,1.42,30.65-7.78,39.85s-28.53,3.1-39.85,7.78C150,214.18,140.5,232,128,232s-22-17.82-33.69-22.68C83,204.64,63.66,210.74,54.46,201.54Z"
                        fill="#10B981"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="16"
                      />
                      <polyline
                        points="88 136 112 160 168 104"
                        fill="none"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="16"
                      />
                    </svg>
                    <span className="text-sm text-green-600">Verified</span>
                  </span>
                </div>
                <div className="text-sx text-gray-700">
                  from Algonquin College
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={4} />
                    <span className="text-lg">4.0</span>
                  </div>
                  <button 
                    className="btn btn-sm btn-primary"
                    disabled={loginUser?._id === sellerId}
                    onClick={() => void handleChatClick()}
                  >
                    Chat
                  </button>
                </div>
              </div>
            </div>
            {/* 关于商品 */}
            <div className="mt-4 flex flex-col">
              <span className="font-medium text-xl">About this item</span>
              <span className="text-sm text-gray-400">Dimensions:</span>
              <span className="text-lg">
                Table 81.3 cm x 40.6 cm x 71.1 cm.
              </span>
              <span className="text-md text-gray-400">
                Click to view the damage images below:
              </span>
              <a
                href="#"
                className="text-lg underline underline-offset-4 text-primary"
              >
                Scratch: 2{" "}
              </a>
            </div>
            {/* 关于配送 */}
            <div className="mt-4 flex flex-col gap-1">
              <span className="font-medium text-xl">
                Home Delivery in 3 days.
              </span>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  className="w-10 h-10"
                >
                  <rect width="256" height="256" fill="none" />
                  <line
                    x1="16"
                    y1="216"
                    x2="240"
                    y2="216"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <polyline
                    points="152 216 152 152 104 152 104 216"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <line
                    x1="40"
                    y1="116.69"
                    x2="40"
                    y2="216"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <line
                    x1="216"
                    y1="216"
                    x2="216"
                    y2="116.69"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <path
                    d="M24,132.69l98.34-98.35a8,8,0,0,1,11.32,0L232,132.69"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                </svg>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    Send to my address <strong>from $50</strong>
                  </span>
                  <span className="text-sm font-bold">Baseline, Ottawa</span>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-4 left-0 right-0 flex justify-center">
            <button 
              disabled={loginUser?._id === sellerId}
              className="btn btn-primary btn-xl w-4/5 rounded-full shadow-md" 
              onClick={() => {
                if (!loginUser) {
                  Toast.show({
                    content: 'Please login first',
                    icon: 'fail'
                  });
                  void navigate('/login');
                  return;
                }
                void navigate("/orderView", {
                  state: {
                    productId: post?._id
                  }
                });
              }}
            >
              Buy now
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default PostDetail;
