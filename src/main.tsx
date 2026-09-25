import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./app/store";
import { router } from "./app/routes";
import "@app/styles/styles.scss";

const root = ReactDOM.createRoot(document.querySelector("#root") as HTMLElement);

root.render(
    <React.StrictMode>
        <Suspense fallback={<>Loading</>}>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </Suspense>
    </React.StrictMode>,
);
