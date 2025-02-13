import { useAuth } from "@/hooks/useAuth";
import { getUser } from "@/services/userService";
import { Button } from "antd-mobile";
import { useNavigate} from "react-router-dom";

const Test:React.FC=()=>{
    const navigate=useNavigate();
    const {user,logout}=useAuth()
    const handleUser=async ()=>{
        await getUser();
    }
    return (
        <>
        <Button onClick={()=>navigate('/register')}>Sign up</Button> 
        <Button onClick={()=>navigate('/login')}>Sign in</Button> 
        <Button onClick={()=>logout()}>Sign out</Button> 
        <Button onClick={()=>navigate('/post')}>Post</Button> 
        <Button onClick={()=>navigate('/order')}>Order</Button> 
        <Button onClick={handleUser}>Get User</Button>
        <div style={{display:'flex',gap:'5px',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <h3>User Info</h3>
            <ul>
                <li>{user?._id}</li>
                <li>{user?.email}</li>
                <li>{String(user?.isVerified)}</li>
            </ul>
        </div>
        </>
    )
}

export default Test;