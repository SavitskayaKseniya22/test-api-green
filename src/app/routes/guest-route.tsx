import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "@/entities/session";

export function GuestRoute() {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
