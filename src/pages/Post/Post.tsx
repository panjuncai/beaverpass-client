import ImageUpload from "@/components/ImageUpload/ImageUpload";
import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "antd-mobile";
import { 
  PostCategory, 
  PostCondition, 
  DeliveryType, 
  CreatePostInput,
  PostImageInput
} from "@/types/post";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useCreatePost } from "@/hooks/usePost";

// 枚举映射
const CATEGORY_OPTIONS = [
  { value: PostCategory.LIVING_ROOM_FURNITURE, label: "Living Room Furniture" },
  { value: PostCategory.BEDROOM_FURNITURE, label: "Bedroom Furniture" },
  { value: PostCategory.DINING_ROOM_FURNITURE, label: "Dining Room Furniture" },
  { value: PostCategory.OFFICE_FURNITURE, label: "Office Furniture" },
  { value: PostCategory.OUTDOOR_FURNITURE, label: "Outdoor Furniture" },
  { value: PostCategory.STORAGE, label: "Storage" },
  { value: PostCategory.OTHER, label: "Other" },
];

const CONDITION_OPTIONS = [
  { value: PostCondition.LIKE_NEW, label: "Like New" },
  { value: PostCondition.GENTLY_USED, label: "Gently Used" },
  { value: PostCondition.MINOR_SCRATCHES, label: "Minor Scratches" },
  { value: PostCondition.STAINS, label: "Stains" },
  { value: PostCondition.NEEDS_REPAIR, label: "Needs Repair" },
];

const DELIVERY_OPTIONS = [
  { value: DeliveryType.HOME_DELIVERY, label: "Home Delivery (via third-party service)" },
  { value: DeliveryType.PICKUP, label: "Pickup by Buyer" },
  { value: DeliveryType.BOTH, label: "Both Options" },
];

const Post: React.FC = () => {
  const { isAuthenticated, session } = useAuth();
  const { uploadBase64Image } = useFileUpload();
  const { createPost, isLoading: isLoadingPost } = useCreatePost();
  const navigate = useNavigate();
  const [showStepTwoTitleError, setShowStepTwoTitleError] = useState(false);
  const [showStepTwoDescriptionError, setShowStepTwoDescriptionError] =
    useState(false);
  const [showStepFourFrontError, setShowStepFourFrontError] = useState(false);

  const [showStepFivePriceError, setShowStepFivePriceError] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // 创建一个图片状态对象，用于存储不同视图的图片
  const [images, setImages] = useState<{
    FRONT?: string;
    SIDE?: string;
    BACK?: string;
    DAMAGE?: string;
  }>({});
  
  // 创建表单数据状态
  const [formData, setFormData] = useState<{
    category: string;
    title: string;
    description: string;
    condition: string;
    amount: string;
    isNegotiable: boolean;
    deliveryType: string;
    isFree: boolean;
  }>({
    category: PostCategory.LIVING_ROOM_FURNITURE,
    title: "",
    description: "",
    condition: PostCondition.LIKE_NEW,
    amount: "",
    isNegotiable: false,
    deliveryType: DeliveryType.HOME_DELIVERY,
    isFree: false,
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
  const handleImageUpload = async (viewType: string, base64String: string) => {
    try {
      // 调用 S3 上传工具上传 base64 图片
      const fileName = `post_${session?.user?.id}_${viewType}.jpg`;
      
      const imageUrl = await uploadBase64Image(base64String, fileName);
      
      // 更新图片状态
      setImages(prev => ({
        ...prev,
        [viewType]: imageUrl
      }));
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      Toast.show({
        icon: 'fail',
        content: 'Upload image failed',
      });
    }
  };

  const handleImageDelete = (viewType: string) => {
    setImages(prev => {
      const newImages = { ...prev };
      delete newImages[viewType as keyof typeof newImages];
      return newImages;
    });
  };
  
  // 格式化价格
  const formatPrice = (value: string) => {
    // 移除非数字和小数点
    let formattedValue = value.replace(/[^\d.]/g, "");
    
    // 确保只有一个小数点
    const parts = formattedValue.split(".");
    if (parts.length > 2) {
      formattedValue = parts[0] + "." + parts.slice(1).join("");
    }

    // 如果是以小数点开始，添加前导零
    if (formattedValue.startsWith(".")) {
      formattedValue = "0" + formattedValue;
    }

    // 限制小数位数为两位
    if (parts.length > 1 && parts[1].length > 2) {
      formattedValue = parts[0] + "." + parts[1].slice(0, 2);
    }

    return formattedValue;
  };

  // 处理价格变更
  const handlePriceChange = (updates: { 
    amount?: string; 
    isNegotiable?: boolean;
    isFree?: boolean;
  }) => {
    const newState = { ...formData };
    
    // 处理免费选项
    if (updates.isFree !== undefined) {
      newState.isFree = updates.isFree;
      
      if (updates.isFree) {
        // 如果设置为免费，金额为0，不可协商
        newState.amount = "0";
        newState.isNegotiable = false;
      } else {
        // 如果从免费切换到收费，清空金额
        newState.amount = "";
      }
    }
    
    // 处理金额更新
    if (updates.amount !== undefined) {
      newState.amount = updates.amount;
      // 如果输入了金额，自动设置为非免费
      if (updates.amount !== "0" && updates.amount !== "") {
        newState.isFree = false;
      }
    }
    
    // 处理可协商选项
    if (updates.isNegotiable !== undefined) {
      newState.isNegotiable = updates.isNegotiable;
    }
    
    // 更新状态
    setFormData(newState);
    
    // 清除价格错误提示
    if (newState.amount !== "" || newState.isNegotiable) {
      setShowStepFivePriceError(false);
    }
  };

  const handleDeliveryChange = (deliveryType: string) => {
    setFormData((prev) => ({ ...prev, deliveryType }));
  };

  // Add form submission handler
  const handleSubmit = async () => {
    if (currentStep === 6) {
      try {
        // 将图片转换为 PostImageInput 数组
        const imageInputs: PostImageInput[] = Object.entries(images).map(
          ([viewType, url]) => ({
            imageUrl: url,
            imageType: viewType
          })
        );
        
        // 如果没有图片，添加错误提示
        if (imageInputs.length === 0) {
          Toast.show({
            icon: 'fail',
            content: 'Please upload at least one image',
          });
          setCurrentStep(4); // 返回到图片上传步骤
          return;
        }
        
        // 准备提交数据
        const postInput: CreatePostInput = {
          category: formData.category,
          title: formData.title,
          description: formData.description,
          condition: formData.condition,
          amount: formData.isFree ? 0 : Number(formData.amount) || 0,
          isNegotiable: formData.isNegotiable,
          deliveryType: formData.deliveryType,
          images: imageInputs
        };

        // 提交帖子
        await createPost(postInput);
        
        // 发布成功后跳转到详情页
        void navigate("/search", { replace: true });
        void Toast.show({
          icon: "success",
          duration: 2000,
        });
      } catch (error) {
        console.error("Failed to create post:", error);
        void Toast.show({
          icon: "fail",
          content: (error as Error).message,
          duration: 2000,
        });
      }
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

    // Step 4 validation
    if (currentStep === 4) {
      if (!images.FRONT) {
        setShowStepFourFrontError(true);
        return;
      }
      setShowStepFourFrontError(false);
    }

    // Step 5 validation
    if (currentStep === 5) {
      if (formData.amount === "0" && !formData.isNegotiable) {
        setShowStepFivePriceError(true);
        return;
      }
      setShowStepFivePriceError(false);
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

  // 通用选择组件
  function CategorySelectionStep({ 
    title, 
    options, 
    value, 
    onChange, 
    label 
  }: { 
    title: string;
    options: typeof CATEGORY_OPTIONS;
    value: string;
    onChange: (value: string) => void;
    label: string;
  }) {
    return (
      <>
        <div className="flex justify-center mt-6 text-2xl text-primary font-bold">
          {title}
        </div>
        <div className="flex justify-center mt-4">
          <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-64">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title text-xl font-semibold flex items-center justify-between text-gray-400">
              {label}
            </div>
            <div className="collapse-content p-0">
              <ul className="menu bg-base-100 w-full text-lg">
                {options.map((option) => (
                  <li
                    key={option.value}
                    className={value === option.value ? "bg-[#7EAC2D]" : ""}
                  >
                    <a
                      className={value === option.value ? "text-white" : ""}
                      onClick={() => onChange(option.value)}
                    >
                      {option.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }

  function ConditionSelectionStep({ 
    title, 
    options, 
    value, 
    onChange, 
    label 
  }: { 
    title: string;
    options: typeof CONDITION_OPTIONS;
    value: string;
    onChange: (value: string) => void;
    label: string;
  }) {
    return (
      <>
        <div className="flex justify-center mt-6 text-2xl text-primary font-bold">
          {title}
        </div>
        <div className="flex justify-center mt-4">
          <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-64">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title text-xl font-semibold flex items-center justify-between text-gray-400">
              {label}
            </div>
            <div className="collapse-content p-0">
              <ul className="menu bg-base-100 w-full text-lg">
                {options.map((option) => (
                  <li
                    key={option.value}
                    className={value === option.value ? "bg-[#7EAC2D]" : ""}
                  >
                    <a
                      className={value === option.value ? "text-white" : ""}
                      onClick={() => onChange(option.value)}
                    >
                      {option.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }

  const stepOne = () => {
    return (
      <CategorySelectionStep
        title="Step 1: Choose a Category"
        options={CATEGORY_OPTIONS}
        value={formData.category}
        onChange={handleCategoryChange}
        label="Category"
      />
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
          {showStepTwoTitleError && (
            <div className="text-error text-sm mt-2">Please enter a title</div>
          )}
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
                maxLength={500}
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e)}
              ></textarea>
            </label>
            <div className="flex w-full mt-2">
              <span className="label-text-alt">
                {formData.description.length}/500 characters
              </span>
            </div>
          </div>
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
      <ConditionSelectionStep
        title="Step 3: Select Condition"
        options={CONDITION_OPTIONS}
        value={formData.condition}
        onChange={handleConditionChange}
        label="Item Condition"
      />
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
              imageUrl={images.FRONT}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
              showError={showStepFourFrontError}
            />
            <ImageUpload
              viewType="SIDE"
              imageUrl={images.SIDE}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
            />
            <ImageUpload
              viewType="BACK"
              imageUrl={images.BACK}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
            />
            <ImageUpload
              viewType="DAMAGE"
              imageUrl={images.DAMAGE}
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
                checked={!formData.isFree}
                onChange={() => handlePriceChange({ isFree: false })}
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Price"
                  className="input input-bordered w-full max-w-xs"
                  value={formData.isFree ? "0" : formData.amount}
                  onChange={(e) => {
                    const value = formatPrice(e.target.value);
                    handlePriceChange({ amount: value });
                  }}
                  disabled={formData.isFree}
                />
              </div>
            </label>
            {showStepFivePriceError && (
              <div className="text-error text-sm mt-2">
                Please enter a price
              </div>
            )}
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-6">
              <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-primary"
                checked={formData.isFree}
                onChange={() => handlePriceChange({ isFree: true })}
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
                checked={formData.isNegotiable}
                onChange={(e) =>
                  handlePriceChange({ isNegotiable: e.target.checked })
                }
                // Disable negotiable checkbox when item is free
                disabled={formData.isFree}
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
        <div className="flex justify-center mt-6 text-2xl text-primary font-bold">
          Step 6: Choose Delivery Options
        </div>
        <div className="flex flex-col justify-center mt-4 p-8">
          {DELIVERY_OPTIONS.map(option => (
            <div className="form-control" key={option.value}>
              <label className="label cursor-pointer justify-start gap-6">
                <input
                  type="radio"
                  name="radio-10"
                  className="radio checked:bg-primary"
                  checked={formData.deliveryType === option.value}
                  onChange={() => handleDeliveryChange(option.value)}
                />
                <span className="label-text text-lg">{option.label}</span>
              </label>
            </div>
          ))}
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
            {!formData.deliveryType && (
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
              disabled={isLoadingPost}
            >
              Previous
            </button>
            <button
              className={`btn btn-primary btn-xl ${
                currentStep === 1 ? "w-4/5" : "w-1/3"
              } rounded-full shadow-md`}
              onClick={() => void handleSubmit()}
              disabled={isLoadingPost}
            >
              {currentStep === 6 ? (
                isLoadingPost ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Publish"
                )
              ) : (
                "Next"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  // 显示未登录
  const noLoginFunc = () => {
    return (
      <>
        <div className="flex flex-col h-full justify-center">
          <LoginCard />
        </div>
      </>
    );
  };
  return (
    <div className="flex flex-col h-full">
      { isAuthenticated ? stepsPost() : noLoginFunc()}
    </div>
  );
};
export default Post;
