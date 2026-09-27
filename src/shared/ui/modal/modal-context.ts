import { createContext } from "react";
import type { ReactNode } from "react";

export interface ModalOptions {
    title: string;
    content: ReactNode;
}

interface ModalContextValue {
    openModal: (options: ModalOptions) => void;
    closeModal: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);
