import { TabBar } from "antd-mobile";
import {
  CameraOutline,
  // HeartOutline,
  MessageOutline,
  ReceivePaymentOutline,
  SearchOutline,
} from "antd-mobile-icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import CustomNavBar from "@/components/CustomNavBar/CustomNavBar";

interface TopProps {
  showBack?: boolean;
  title?: string|React.ReactNode;
  showNavBar?: boolean;
}

const Top: React.FC<TopProps> = ({ showBack = false, title = "", showNavBar = true }) => {
  return (
    <div className="top">
      {showNavBar && <CustomNavBar title={title} showBack={showBack} />}
      
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

interface AppLayoutProps {
  showBack?: boolean;
  title?: string | React.ReactNode;
  showNavBar?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  showBack, 
  title,
  showNavBar = true 
}) => {
  return (
    <>
      <Top showBack={showBack} title={title} showNavBar={showNavBar} />
      <div className={`body ${!showNavBar ? 'mt-0' : ''}`}>
        <Outlet />
      </div>
      <div className="bottom">
        <Bottom />
      </div>
    </>
  );
};

export default AppLayout;
