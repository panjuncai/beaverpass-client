import ImageUpload from "@/components/ImageUpload/ImageUpload";
import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
const Post: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [description, setDescription] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [1, 2, 3, 4, 5, 6];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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

  const stepThree = () => {
    return (
      <>
        {/* 选择分类 */}
        <div className="flex justify-center mt-6 text-2xl text-primary font-bold">
          Step 3: Select Condition
        </div>
        <div className="flex justify-center mt-4">
          <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-64">
            {/* 用 checkbox 让 collapse 可点击展开/收起 */}
            <input type="checkbox" defaultChecked />

            {/* 标题区域 */}
            <div className="collapse-title text-xl font-semibold flex items-center justify-between text-gray-400">
              Item Condition
            </div>

            {/* 内容区域：放一个 menu 列表 */}
            <div className="collapse-content p-0">
              <ul className="menu bg-base-100 w-full text-lg">
                <li className="bg-[#7EAC2D]">
                  <a className="text-white">Like New</a>
                </li>
                <li>
                  <a>Gently Used</a>
                </li>
                <li>
                  <a>Minor Scratches</a>
                </li>
                <li>
                  <a>Stains</a>
                </li>
                <li>
                  <a>Needs Repair</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  };

  const stepFour = () => {
    return (
      <>
        {/* 选择分类 */}
        <div className="flex justify-center mt-6 text-2xl text-primary font-bold">
          Step 4: Add Photos
        </div>
        <div className="flex justify-center mt-4">
          <ImageUpload />
        </div>
      </>
    );
  };

  const stepFive = () => {
    return (
      <>
        {/* 选择分类 */}
        <div className="flex justify-center mt-6 text-2xl text-primary font-bold">
          Step 5: Set Your Price
        </div>
        <div className="flex flex-col justify-center mt-4 p-8">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-primary"
                defaultChecked
              />
              <input
                type="text"
                placeholder="Price"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-6">
              <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-primary"
              />
              <span className="label-text text-lg">Free</span>
            </label>
          </div>
          <hr className="border-gray-200 mt-4" />
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-6">
              <input type="checkbox" className="checkbox" />
              <span className="label-text text-lg">Price is negotiable</span>
            </label>
          </div>
        </div>
      </>
    );
  };

  const stepSix = () => {
    return (
      <>
        {/* 选择分类 */}
        <div className="flex justify-center mt-6 text-2xl text-primary font-bold">
          Step 6: Choose Delivery Options
        </div>
        <div className="flex flex-col justify-center mt-4 p-8">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-6">
              <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-primary"
                defaultChecked
              />
              <span className="label-text text-lg">
                Home Delivery (via third-party service)
              </span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-6">
              <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-primary"
              />
              <span className="label-text text-lg">Pickup by Buyer</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-6">
              <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-primary"
              />
              <span className="label-text text-lg">Both Options</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-primary"
              viewBox="0 0 256 256"
            >
              <rect width="256" height="256" fill="none" />
              <path
                d="M96,192a32,32,0,0,0,64,0"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <path
                d="M184,24a102.71,102.71,0,0,1,36.29,40"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <path
                d="M35.71,64A102.71,102.71,0,0,1,72,24"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <path
                d="M56,112a72,72,0,0,1,144,0c0,35.82,8.3,56.6,14.9,68A8,8,0,0,1,208,192H48a8,8,0,0,1-6.88-12C47.71,168.6,56,147.81,56,112Z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
            </svg>
            <span className="text-gray-400 text-md">
              Choose the delivery methods you can offer. Delivery services may
              charge extra.
            </span>
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
            {steps.map((step) => {
              let dataContent = "";
              let stepClass = "step text-sm";
              if (step < currentStep) {
                stepClass += " step-success";
                dataContent = "✓";
              } else if (step === currentStep) {
                dataContent = "●";
                stepClass += " step-success";
              }
              return (
                <li key={step} data-content={dataContent} className={stepClass}>
                  {step}
                </li>
              );
            })}
          </ul>
        </div>
        {currentStep === 1
          ? stepOne()
          : currentStep === 2
          ? stepTwo()
          : currentStep === 3
          ? stepThree()
          : currentStep === 4
          ? stepFour()
          : currentStep === 5
          ? stepFive()
          : stepSix()}

        {/* 下一步 */}
        <div className="fixed bottom-16 left-0 right-0 flex justify-center mt-8">
          <div className="flex items-center gap-6 w-full justify-center">
            <button
              className={`btn btn-outline text-primary btn-xl w-1/3 rounded-full shadow-md ${
                currentStep === 1 ? "hidden" : ""
              }`}
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              className={`btn btn-primary btn-xl ${
                currentStep === 1 ? "w-4/5" : "w-1/3"
              } rounded-full shadow-md`}
              onClick={handleNext}
            >
              {currentStep === 6 ? "Publish" : "Next"}
            </button>
          </div>
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
