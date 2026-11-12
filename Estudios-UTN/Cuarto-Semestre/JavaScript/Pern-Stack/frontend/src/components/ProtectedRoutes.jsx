import { Children } from "react";
import { Outlet } from "react-router-dom";

export const ProtectedRoute = ({redirecTo, isAllowed, Children}) => {
    if(!isAllowed){
        return <Navigation to={redirecTo} replace />;
    }
    return Children ? Children : <Outlet />;
}