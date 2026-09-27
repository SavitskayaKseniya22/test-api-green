import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { PrivateRoute } from "./private-route";
import { GuestRoute } from "./guest-route";
import { RootLayout } from "./root-layout";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />} errorElement={<div>Something happened</div>}>
            <Route element={<PrivateRoute />}>
                <Route index element={<></>} />
            </Route>
            <Route element={<GuestRoute />}>
                <Route path="login" element={<LoginPage />} />
            </Route>
            <Route path="*" element={<div>Page not found</div>} />
        </Route>,
    ),
);

export default router;
