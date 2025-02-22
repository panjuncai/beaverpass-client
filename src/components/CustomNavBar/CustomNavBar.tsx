/* eslint-disable react/prop-types */
import { LeftOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";

interface CustomNavBarProps {
  title?: string;
  showBack?: boolean;  // 新增控制返回按钮显示的属性
}

const CustomNavBar: React.FC<CustomNavBarProps> = ({ 
  title,
  showBack = true  // 默认显示返回按钮
}) => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      {/* 左侧返回按钮（根据showBack控制显示） */}
      <div className="flex-0">
        {showBack && (
          <button
            onClick={() => void navigate(-1)}
          >
            <LeftOutline fontSize={24}/>
          </button>
        )}
      </div>

      {/* 标题 */}
      {title && (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-lg font-bold">{title}</span>
        </div>
      )}

      {/* 右侧占位 */}
      {showBack && <div className="flex-0 w-[24px]"></div>}
    </div>
  );
};

export default CustomNavBar;
