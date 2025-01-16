import { getUser } from "@/services/userService";
import { Button } from "antd-mobile";
import { useNavigate} from "react-router-dom";

const Main:React.FC=()=>{
    const navigate=useNavigate();
    const handleUser=async ()=>{
        await getUser();
    }
    return (
        <>Main
        <Button onClick={()=>navigate('/register')}>Sign up</Button> 
        <Button onClick={()=>navigate('/login')}>Sign in</Button> 
        <Button onClick={handleUser}>Get User</Button> 
        </>
    )
}

export default Main;