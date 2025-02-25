/* eslint-disable react/prop-types */
import { LeftOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
interface CustomNavBarProps {
  title?: string|React.ReactNode;
  showBack?: boolean;  // 新增控制返回按钮显示的属性
}

const CustomNavBar: React.FC<CustomNavBarProps> = ({ 
  title,
  showBack = true  // 默认显示返回按钮
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, loginUser } = useAuth();
  return (
    <div className="navbar">
      {/* 左侧返回按钮（根据showBack控制显示） */}
      {/* 左侧占位 */}
      {!showBack && <div className="flex-0 w-[24px]"></div>}
      {showBack && (<div className="flex-0">
          <button
            onClick={() => void navigate(-1)}
          >
            <LeftOutline fontSize={24}/>
          </button>
        </div>
      )}

      {/* 标题 */}
      {title && (
        <div className="flex-1 flex items-center justify-center">
          {typeof title === 'string' ? (
            <span className="text-lg font-bold">{title}</span>
          ) : (
            title
          )}
        </div>
      )}

      {/* 右侧占位 */}
      {/* {showBack && <div className="flex-0 w-[24px]"></div>} */}
      <div className="flex-0">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none" />
                <circle
                  cx="128"
                  cy="128"
                  r="96"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <circle
                  cx="128"
                  cy="120"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <path
                  d="M63.8,199.37a72,72,0,0,1,128.4,0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
              </svg>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile">
                    {(loginUser?.firstName ?? '') + (loginUser?.lastName ?? '')} Profile Settings
                  </Link>
                </li>
                <li>
                  <button onClick={() => void logout()}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomNavBar;
