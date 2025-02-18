import EmptyDeal from "@/components/Empty/EmptyDeal";
import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";

const Deals: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated ? (
        <EmptyDeal></EmptyDeal>
      ) : (
        <div className="flex flex-col h-full justify-center">
          <LoginCard></LoginCard>
        </div>
      )}
    </>
  );
};
export default Deals;
