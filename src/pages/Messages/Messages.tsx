import CustomNavBar from "@/components/CustomNavBar/CustomNavBar";
// import EmptyMessage from "@/components/Empty/EmptyMessage";
import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";

const Messages: React.FC = () => {
  const { isAuthenticated } = useAuth();
  {
    /* <EmptyMessage /> */
  }
  const LoginCardFunc = () => {
    return
    <>
      <div className="flex flex-col h-full justify-center">
        <LoginCard></LoginCard>
      </div>
    </>;
  };
  const MessagesBuyFunc = () => {
    return (
      <div className="">
        <div role="tablist" className="tabs tabs-bordered">
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Tab 1"
          />
          <div role="tabpanel" className="tab-content p-10">
            Tab content 1
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Tab 2"
            defaultChecked
          />
          <div role="tabpanel" className="tab-content p-10">
            Tab content 2
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <CustomNavBar title="Messages" />
      {isAuthenticated ? MessagesBuyFunc() : LoginCardFunc()}
    </>
  );
};
export default Messages;
