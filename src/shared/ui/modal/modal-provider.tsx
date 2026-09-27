import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ModalContext } from "./modal-context";
import type { ModalOptions } from "./modal-context";
import { Modal } from "./modal";

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ModalOptions | null>(null);

    const openModal = useCallback((options: ModalOptions) => setModal(options), []);
    const closeModal = useCallback(() => setModal(null), []);

    const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

    return (
        <ModalContext.Provider value={value}>
            {children}
            <Modal open={modal !== null} onClose={closeModal} title={modal?.title ?? ""}>
                {modal?.content}
            </Modal>
        </ModalContext.Provider>
    );
}
