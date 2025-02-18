import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";
const Post: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const stepsPost = () => {
    return (
      <div className="p-4">
        {/* 步骤条 */}
        <ul className="mt-4 steps steps-horizontal">
          <li data-content="✓" className="step step-success text-2xl">
            1
          </li>
          <li data-content="✓" className="step step-success text-2xl">
            2
          </li>
          <li data-content="●" className="step step-success text-2xl">
            3
          </li>
          <li data-content="" className="step text-2xl">
            4
          </li>
          <li data-content="" className="step text-2xl">
            5
          </li>
          <li data-content="" className="step text-2xl">
            6
          </li>
        </ul>

        {/* 选择分类 */}
        <div className="flex justify-center mt-6 text-2xl text-primary font-bold">
          Step 1: Choose a Category
        </div>
        <div className="flex justify-center mt-8">
          <div
            // tabindex="0"
            className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-64"
          >
            {/* 用 checkbox 让 collapse 可点击展开/收起 */}
            <input type="checkbox" defaultChecked disabled/>

            {/* 标题区域 */}
            <div className="collapse-title text-xl font-semibold flex items-center justify-between text-gray-400">
              Category
            </div>

            {/* 内容区域：放一个 menu 列表 */}
            <div className="collapse-content p-0">
              <ul className="menu bg-base-100 w-full text-lg">
                <li className="bg-[#7EAC2D]">
                  <a className="text-white">Living Room Furniture</a>
                </li>
                <li>
                  <a>Bedroom Furniture</a>
                </li>
                <li>
                  <a>Dining Room Furniture</a>
                </li>
                <li>
                  <a>Office Furniture</a>
                </li>
                <li>
                  <a>Outdoor Furniture</a>
                </li>
                <li>
                  <a>Storage</a>
                </li>
                <li>
                  <a>Other</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 下一步 */}
        <div className="flex justify-center mt-8">
            <button className="btn btn-primary btn-xl w-4/5 rounded-full shadow-md">
              Next
            </button>
          </div>
       </div>
    );
  };
  // 显示未登录
  const noLoginFunc = () => {
    return (
      <div className="flex flex-col h-full justify-center">
        <LoginCard />
      </div>
    );
  };
  return <>{isAuthenticated ? stepsPost() : noLoginFunc()}</>;
};
export default Post;
