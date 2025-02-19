import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
const Post: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [description, setDescription] = useState("");
  const stepOne = () => {
    return (
      <>
        {/* 选择分类 */}
        <div className="flex justify-center mt-6 text-2xl text-primary font-bold">
          Step 1: Choose a Category
        </div>
        <div className="flex justify-center mt-4">
          <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-64">
            {/* 用 checkbox 让 collapse 可点击展开/收起 */}
            <input type="checkbox" defaultChecked />

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
      </>
    );
  };
  const stepTwo = () => {
    return (
      <>
        {/* 选择分类 */}
        <div className="flex justify-center mt-6 text-2xl text-primary font-bold">
          Step 2: Describe Your Item
        </div>
        <div className="p-6">
          {/* 输入标题和描述 */}
          <div className="flex justify-center mt-4">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="w-2 h-2"
              >
                <rect width="256" height="256" fill="none" />
                <line
                  x1="128"
                  y1="40"
                  x2="128"
                  y2="216"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <line
                  x1="48"
                  y1="80"
                  x2="208"
                  y2="176"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <line
                  x1="48"
                  y1="176"
                  x2="208"
                  y2="80"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
              </svg>
              <input type="text" className="grow" placeholder="Title" />
            </label>
          </div>
          <div className="flex flex-col items-center mt-4">
            {/* 外层容器：带边框、圆角，使用 group 触发子元素的悬停样式 */}
            <div className="group w-full border border-base-300 bg-base-100 rounded-xl transition-all group-focus-within:border-primary group-focus-within:ring group-focus-within:ring-primary/50">
              {/* 上部分：图标 + 禁用输入框 */}
              <label
                className="
            flex items-center gap-2 
            px-3 py-2 
            border-b-none border-base-300
            group-hover:cursor-pointer
          "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  className="w-2 h-2"
                >
                  <rect width="256" height="256" fill="none" />
                  <line
                    x1="128"
                    y1="40"
                    x2="128"
                    y2="216"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <line
                    x1="48"
                    y1="80"
                    x2="208"
                    y2="176"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <line
                    x1="48"
                    y1="176"
                    x2="208"
                    y2="80"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                </svg>
                {/* 禁用输入框 */}
                <input
                  type="text"
                  className="grow bg-transparent outline-none text-lg"
                  placeholder="Description"
                  readOnly
                />
              </label>

              {/* 下部分：可编辑文本域 */}
              <textarea
                className="
            w-full h-40
            bg-base-100
            px-3 py-2
            bg-transparent
            outline-none
            border-0
            group-hover:cursor-pointer
          "
                placeholder="E.g., Solid wood dining table with minor scratches on the top surface. Dimensions: 120cm x 80cm."
                maxLength={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* 底部字符计数 */}
            <label className="label w-full">
              <span className="label-text-alt">
                {description.length}/10 characters
              </span>
            </label>
          </div>
        </div>
      </>
    );
  };
  const stepsPost = () => {
    return (
      <div>
        {/* 步骤条 */}
        <div className="flex justify-center">
          <ul className="mt-4 steps steps-horizontal">
            <li data-content="✓" className="step step-success text-sm">
              1
            </li>
            <li data-content="✓" className="step step-success text-sm">
              2
            </li>
            <li data-content="●" className="step step-success text-sm">
              3
            </li>
            <li data-content="" className="step text-sm">
              4
            </li>
            <li data-content="" className="step text-sm">
              5
            </li>
            <li data-content="" className="step text-sm">
              6
            </li>
          </ul>
        </div>
        {/* {stepOne()} */}
        {stepTwo()}

        {/* 下一步 */}
        <div className="fixed bottom-16 left-0 right-0 flex justify-center mt-8">
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
