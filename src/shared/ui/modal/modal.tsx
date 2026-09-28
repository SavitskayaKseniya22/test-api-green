import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import styles from "./modal.module.scss";
import { Button } from "../button";

interface ModalProperties {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProperties) {
    const dialogReference = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        if (!open) return;

        const dialog = dialogReference.current;
        if (!dialog) return;

        const previousOverflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = "hidden";

        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    return (
        <dialog
            ref={dialogReference}
            className={styles.modal}
            aria-labelledby={titleId}
            onCancel={event => {
                event.preventDefault();
                onClose();
            }}>
            {open && (
                <>
                    <header className={styles.header}>
                        <h2 id={titleId}>{title}</h2>
                        <Button
                            type="button"
                            view="transparent"
                            className={styles.close}
                            onClick={onClose}
                            aria-label="Закрыть">
                            ×
                        </Button>
                    </header>
                    {children}
                </>
            )}
        </dialog>
    );
}
