// import apiClient from "@/api/api";
// import { User } from "@/types/user";
import { createContext, useContext} from "react";

const AuthContext = createContext(null);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

// export function AuthProvider({ children}) {
//   // const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       apiClient
//         .get("/api/user")
//         .then((user) => {
//           //setUser(user);
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, []);

  // const login=async(email:string,password:string):User=>{
  //   try{
  //   }catch(e){
        
  //   }
  // }
// }
