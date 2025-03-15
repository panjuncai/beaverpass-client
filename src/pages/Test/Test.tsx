import { useAuth } from "@/hooks/useAuth";
import { Button } from "antd-mobile";
import { useNavigate} from "react-router-dom";

const Test:React.FC=()=>{
    const navigate=useNavigate();
    const {session}=useAuth()
    return (
        <>
        <Button onClick={()=>navigate('/register')}>Sign up</Button> 
        <Button onClick={()=>navigate('/login')}>Sign in</Button> 
        <Button onClick={()=>navigate('/post')}>Post</Button> 
        <Button onClick={()=>navigate('/order')}>Order</Button> 
        <div style={{display:'flex',gap:'5px',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <h3>Login User Info</h3>
            <ul>
                <li>{session?.user?.id}</li>
                <li>{session?.user?.email}</li>
            </ul>
        </div>
        </>
    )
}

export default Test;