import EmptyMessage from "@/components/Empty/EmptyMessage";
import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";

const Post: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated ? (
        <div>Post</div>
      ) : (
        <div className="flex flex-col h-full justify-center">
          <LoginCard />
        </div>
      )}
    </>
  );
};
export default Post;
