import { Button } from "antd-mobile";
import { useNavigate} from "react-router-dom";

const Main:React.FC=()=>{
    const navigate=useNavigate();
    return (
        <>Main
        <Button onClick={()=>navigate('/register')}>Sign up</Button> 
        <Button onClick={()=>navigate('/login')}>Sign in</Button> 
        </>
    )
}

export default Main;