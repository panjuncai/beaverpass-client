import { TabBar } from "antd-mobile";
import {
  CameraOutline,
  // HeartOutline,
  MessageOutline,
  ReceivePaymentOutline,
  SearchOutline,
} from "antd-mobile-icons";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Top = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="fixed top-1 right-1 z-50">
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
                <Link to="/profile">Profile Settings</Link>
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
  );
};

/* eslint-disable react/prop-types */
const Bottom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const Title: React.FC<{ msg: string }> = ({ msg }) => {
    return <span className="no-select">{msg}</span>;
  };
  const setRouteActive = (value: string) => {
    void navigate(value);
  };

  const tabs = [
    // { key: "/test", title: <Title msg="Test" />, icon: <SmileOutline /> },
    { key: "/search", title: <Title msg="Search" />, icon: <SearchOutline /> },
    {
      key: "/inbox",
      title: <Title msg="Inbox" />,
      icon: <MessageOutline />,
    },
    { key: "/post", title: <Title msg="Post" />, icon: <CameraOutline /> },
    {
      key: "/deals",
      title: <Title msg="Deals" />,
      icon: <ReceivePaymentOutline />,
    },
    // {
    //   key: "/favourites",
    //   title: <Title msg="Favourites" />,
    //   icon: <HeartOutline />,
    // },
  ];

  return (
    <TabBar
      safeArea
      activeKey={pathname}
      onChange={(value) => setRouteActive(value)}
    >
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};

const AppLayout: React.FC = () => {
  return (
    <>
      <Top />
      <div className="body">
        <Outlet />
      </div>
      <div className="bottom">
        <Bottom />
      </div>
    </>
  );
};

export default AppLayout;
