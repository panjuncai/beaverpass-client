import { TabBar } from "antd-mobile";
import {
  CameraOutline,
  // HeartOutline,
  MessageOutline,
  ReceivePaymentOutline,
  SearchOutline,
  SmileOutline,
} from "antd-mobile-icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Bottom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const Title: React.FC<{ msg: string }> = ({ msg }) => {
    return <span className="no-select">{msg}</span>;
  };
  const setRouteActive = (value: string) => {
    navigate(value);
  };

  const tabs = [
    { key: "/test", title: <Title msg="Test" />, icon: <SmileOutline /> },
    { key: "/search", title: <Title msg="Search" />, icon: <SearchOutline /> },
    {
      key: "/messages",
      title: <Title msg="Messages" />,
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
