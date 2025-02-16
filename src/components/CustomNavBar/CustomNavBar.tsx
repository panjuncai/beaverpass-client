import { LeftOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
interface CustomNavBarProps{
    title?:string
}
const CustomNavBar:React.FC<CustomNavBarProps> = ({title}) => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      {/* 左侧返回按钮（显示图标） */}
      <div className="flex-0">
        <button
          onClick={() => navigate(-1)}
        >
            <LeftOutline fontSize={24}/>
        </button>
      </div>

      {/* 标题 */}
      {title&&
      <div className="flex-1 flex items-center justify-center">
        <span className="text-lg font-bold">{title}</span>
      </div>}

      {/* 右侧占位 */}
      <div className="flex-0 w-[24px]"></div>
    </div>
  );
};

export default CustomNavBar;
