import { Outlet } from "react-router-dom";
import { ModalProvider } from "@/shared/ui/modal";

export function RootLayout() {
    return (
        <ModalProvider>
            <Outlet />
        </ModalProvider>
    );
}
