import EmptyMessage from "@/components/Empty/EmptyMessage";
import LoginCard from "@/components/LoginCard/LoginCard";
import { useAuth } from "@/hooks/useAuth";

const Messages:React.FC=()=>{
  const {isAuthenticated}=useAuth();
  return <>
    {
      isAuthenticated?<EmptyMessage></EmptyMessage>:
      <div className="flex flex-col h-full justify-center">
      <LoginCard></LoginCard></div>
    }
  </>
}
export default Messages;