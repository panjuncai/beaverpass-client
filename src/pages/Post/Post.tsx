import ImageUpload from "@/components/ImageUpload/ImageUpload";
import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
const Post: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showStepTwoTitleError, setShowStepTwoTitleError] = useState(false);
  const [showStepTwoDescriptionError, setShowStepTwoDescriptionError] =
    useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "Living Room Furniture",
    title: "",
    description: "",
    condition: "Like New",
    images: {
      FRONT: null,
      SIDE: null,
      BACK: null,
      DAMAGE: null,
    } as Record<string, string | null>,
    price: {
      amount: "",
      isFree: false,
      isNegotiable: false,
    },
    delivery: "Home Delivery",
  });

  const steps = [1, 2, 3, 4, 5, 6];

  // Update handlers for each step
  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({ ...prev, title }));
    if (!title.trim()) {
      setShowStepTwoTitleError(true);
    } else {
      setShowStepTwoTitleError(false);
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
    if (!e.target.value.trim()) {
      setShowStepTwoDescriptionError(true);
    } else {
      setShowStepTwoDescriptionError(false);
    }
  };

  const handleConditionChange = (condition: string) => {
    setFormData((prev) => ({ ...prev, condition }));
  };

  // 添加图片处理函数
  const handleImageUpload = (viewType: string, base64String: string) => {
    try {
      // 这里应该调用你的上传API
      // const response = await uploadImage(file);
      // const imageUrl = response.url;

      setFormData((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [viewType]: base64String,
        },
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      // 处理错误
    }
  };

  const handleImageDelete = (viewType: string) => {
    setFormData((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [viewType]: null,
      },
    }));
  };

  const formatPrice = (value: string) => {
    // Remove any non-digit characters except decimal point
    value = value.replace(/[^\d.]/g, "");

    // Ensure only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to two decimal places
    if (parts[1]?.length > 2) {
      value = parts[0] + "." + parts[1].slice(0, 2);
    }

    return value;
  };

  // const handleImagesChange = (images: Record<string, string | null>) => {
  //   setFormData((prev) => ({ ...prev, images }));
  // };

  const handlePriceChange = (updates: Partial<typeof formData.price>) => {
    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        ...updates,
        // If setting to free, clear the amount
        amount: updates.isFree
          ? ""
          : updates.amount !== undefined
          ? updates.amount
          : prev.price.amount,
        // If setting to free, set negotiable to false
        isNegotiable: updates.isFree
          ? false
          : updates.isNegotiable !== undefined
          ? updates.isNegotiable
          : prev.price.isNegotiable,
      },
    }));
  };

  const handleDeliveryChange = (delivery: string) => {
    setFormData((prev) => ({ ...prev, delivery }));
  };

  // Add form submission handler
  const handleSubmit = () => {
    if (currentStep === 6) {
      console.log("Form data to submit:", formData);
      // Add your API call here to save the data
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    // Step 2 validation
    if (currentStep === 2) {
      let isValid = true;

      // Reset error states
      setShowStepTwoTitleError(false);
      setShowStepTwoDescriptionError(false);

      // Check title
      if (!formData.title.trim()) {
        setShowStepTwoTitleError(true);
        isValid = false;
      }

      // Check description
      if (!formData.description.trim()) {
        setShowStepTwoDescriptionError(true);
        isValid = false;
      }

      // If validation fails, don't proceed
      if (!isValid) {
        return;
      }
    }

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
                {[
                  "Living Room Furniture",
                  "Bedroom Furniture",
                  "Dining Room Furniture",
                  "Office Furniture",
                  "Outdoor Furniture",
                  "Storage",
                  "Other",
                ].map((cat) => (
                  <li
                    key={cat}
                    className={formData.category === cat ? "bg-[#7EAC2D]" : ""}
                  >
                    <a
                      className={formData.category === cat ? "text-white" : ""}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {!formData.category && (
          <div className="text-error text-sm mt-2">
            Please select a category
          </div>
        )}
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
              <input
                type="text"
                className="grow"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-col items-center mt-4">
            <label className="input input-bordered flex items-start gap-2 w-full h-48">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="w-2 h-2 mt-4"
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
                <textarea
                  className="grow h-full resize-none bg-transparent border-none outline-none pt-1"
                  placeholder={`Description
E.g., Solid wood dining table with minor scratches on the top surface. Dimensions: 120cm x 80cm.
            `}
                  maxLength={10}
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e)}
                ></textarea>
            </label>
            <div className="flex w-full mt-2">
                  <span className="label-text-alt">
                    {formData.description.length}/10 characters
                  </span>
                </div>
          </div>
          {showStepTwoTitleError && (
            <div className="text-error text-sm mt-2">Please enter a title</div>
          )}
          {showStepTwoDescriptionError && (
            <div className="text-error text-sm mt-2">
              Please enter a description
            </div>
          )}
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
                {[
                  "Like New",
                  "Gently Used",
                  "Minor Scratches",
                  "Stains",
                  "Needs Repair",
                ].map((condition) => (
                  <li
                    key={condition}
                    className={
                      formData.condition === condition ? "bg-[#7EAC2D]" : ""
                    }
                  >
                    <a
                      className={
                        formData.condition === condition ? "text-white" : ""
                      }
                      onClick={() => handleConditionChange(condition)}
                    >
                      {condition}
                    </a>
                  </li>
                ))}
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
          <div className="pl-12 space-y-6 w-full">
            <ImageUpload
              viewType="FRONT"
              imageUrl={formData.images.FRONT}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
            />
            <ImageUpload
              viewType="SIDE"
              imageUrl={formData.images.SIDE}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
            />
            <ImageUpload
              viewType="BACK"
              imageUrl={formData.images.BACK}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
            />
            <ImageUpload
              viewType="DAMAGE"
              imageUrl={formData.images.DAMAGE}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
            />
          </div>
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
                checked={!formData.price.isFree}
                onChange={() => handlePriceChange({ isFree: false })}
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Price"
                  className="input input-bordered w-full max-w-xs"
                  value={formData.price.amount}
                  onChange={(e) =>
                    handlePriceChange({ amount: formatPrice(e.target.value) })
                  }
                  disabled={formData.price.isFree}
                />
              </div>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-6">
              <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-primary"
                checked={formData.price.isFree}
                onChange={() => {
                  handlePriceChange({
                    isFree: true,
                    amount: "", // Clear price when selecting Free
                  });
                }}
              />
              <span className="label-text text-lg">Free</span>
            </label>
          </div>
          <hr className="border-gray-200 mt-4" />
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-6">
              <input
                type="checkbox"
                className="checkbox"
                checked={formData.price.isNegotiable}
                onChange={(e) =>
                  handlePriceChange({ isNegotiable: e.target.checked })
                }
                // Optionally disable negotiable checkbox when item is free
                disabled={formData.price.isFree}
              />
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
                checked={formData.delivery === "Home Delivery"}
                onChange={() => handleDeliveryChange("Home Delivery")}
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
                checked={formData.delivery === "Pickup"}
                onChange={() => handleDeliveryChange("Pickup")}
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
                checked={formData.delivery === "Both"}
                onChange={() => handleDeliveryChange("Both")}
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
              <path
                d="M184,24a102.71,102.71,0,0,1,36.29,40"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
              <path
                d="M35.71,64A102.71,102.71,0,0,1,72,24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
              <path
                d="M56,112a72,72,0,0,1,144,0c0,35.82,8.3,56.6,14.9,68A8,8,0,0,1,208,192H48a8,8,0,0,1-6.88-12C47.71,168.6,56,147.81,56,112Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
            </svg>
            <span className="text-gray-400 text-md">
              Choose the delivery methods you can offer. Delivery services may
              charge extra.
            </span>
            {!formData.delivery && (
              <div className="text-error text-sm mt-2">
                Please select a delivery option
              </div>
            )}
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
              onClick={handleSubmit}
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
