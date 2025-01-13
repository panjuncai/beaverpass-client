import { routes } from "@/routes";
import { useEffect } from "react";
import { useLocation } from "react-router-dom"


export const usePageTitle=():void=>{
    const location=useLocation();
    useEffect(()=>{
        const match=routes.find((route)=>new RegExp(`^${route.path}$`).test(location.pathname))
        if(match?.meta?.title){
            document.title=match.meta.title;
        }
    },[location])
}