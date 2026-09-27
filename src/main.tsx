import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store, persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { router } from "./app/routes";
import "@fontsource-variable/roboto";
import "@app/styles/styles.scss";

const root = ReactDOM.createRoot(document.querySelector("#root") as HTMLElement);

root.render(
    <React.StrictMode>
        <Suspense fallback={<>Загрузка…</>}>
            <Provider store={store}>
                <PersistGate loading={<p role="status">Загрузка…</p>} persistor={persistor}>
                    <RouterProvider router={router} />
                </PersistGate>
            </Provider>
        </Suspense>
    </React.StrictMode>,
);
