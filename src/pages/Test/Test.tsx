import { useAuth } from "@/hooks/useAuth";
import { Button } from "antd-mobile";
import { useNavigate} from "react-router-dom";

const Test:React.FC=()=>{
    const navigate=useNavigate();
    const {loginUser,logout}=useAuth()
    return (
        <>
        <Button onClick={()=>navigate('/register')}>Sign up</Button> 
        <Button onClick={()=>navigate('/login')}>Sign in</Button> 
        <Button onClick={()=>logout()}>Sign out</Button> 
        <Button onClick={()=>navigate('/post')}>Post</Button> 
        <Button onClick={()=>navigate('/order')}>Order</Button> 
        <div style={{display:'flex',gap:'5px',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <h3>Login User Info</h3>
            <ul>
                <li>{loginUser?._id}</li>
                <li>{loginUser?.email}</li>
                <li>{String(loginUser?.isVerified)}</li>
            </ul>
        </div>
        </>
    )
}

export default Test;