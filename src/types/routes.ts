export interface RouteConfig {
    path:string;
    element:React.JSX.Element;
    children?:RouteConfig[];
    meta?:{
        requiresAuth?:boolean;
        title?:string;
    }
}