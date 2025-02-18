import CustomNavBar from "@/components/CustomNavBar/CustomNavBar";
// import EmptyMessage from "@/components/Empty/EmptyMessage";
import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";

const Inbox: React.FC = () => {
  const { isAuthenticated } = useAuth();
  {
    /* <EmptyMessage /> */
  }
  const LoginCardFunc = () => {
    return (
      <>
        <div className="flex flex-col h-full justify-center">
          <LoginCard></LoginCard>
        </div>
      </>
    );
  };
  const InboxBuyFunc = () => {
    return (
      <div className="flex-1">
        <div role="tablist" className="tabs tabs-bordered grid-cols-3 ">
        <input
            type="radio"
            name="tabs_1"
            role="tab"
            className="tab text-primary font-bold text-xl"
            aria-label="All"
          />
          <div role="tabpanel" className="tab-content p-10">
            All
          </div>
          <input
            type="radio"
            name="tabs_1"
            role="tab"
            className="tab text-primary font-bold text-xl"
            aria-label="Buying"
          />
          <div role="tabpanel" className="tab-content p-10">
            Buying
          </div>

          <input
            type="radio"
            name="tabs_1"
            role="tab"
            className="tab text-primary font-bold text-xl"
            aria-label="Selling"
            defaultChecked
          />
          <div role="tabpanel" className="tab-content p-10">
            Selling
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col h-full">
      <CustomNavBar title="Inbox" />
      {isAuthenticated ? InboxBuyFunc() : LoginCardFunc()}
    </div>
  );
};
export default Inbox;
