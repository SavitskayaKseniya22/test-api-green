import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { MainPage } from "@/pages/main";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" errorElement={<div>Something happened</div>}>
            <Route index element={<MainPage />} />
            <Route path="*" element={<div>Page not found</div>} />
        </Route>,
    ),
);

export default router;
