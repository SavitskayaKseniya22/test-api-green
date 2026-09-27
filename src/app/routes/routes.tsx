import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { PrivateRoute } from "./private-route";
import { GuestRoute } from "./guest-route";
import { RootLayout } from "./root-layout";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />} errorElement={<div>Something happened</div>}>
            <Route element={<PrivateRoute />}>
                <Route index element={<>Main page</>} />
            </Route>
            <Route element={<GuestRoute />}>
                <Route path="login" element={<>Login page</>} />
            </Route>
            <Route path="*" element={<div>Page not found</div>} />
        </Route>,
    ),
);

export default router;
