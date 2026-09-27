import type { ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./input.module.scss";
import clsx from "clsx";

interface LabeledInputProperties extends React.ComponentProps<"input"> {
    label?: string | ReactNode;
    errorMessage?: string;
    type?: Extract<React.HTMLInputTypeAttribute, "text" | "password" | "number" | "email"> | undefined;
}

const Input = forwardRef<HTMLInputElement, LabeledInputProperties>(function Input(
    {
        label,

        errorMessage,

        className,
        ...properties
    },
    reference,
) {
    return (
        <label className={clsx(styles.input, className)}>
            {label ? <div className={styles.input__label}>{label}</div> : undefined}
            <div
                className={clsx(styles.input__container, {
                    [styles.input__container_invalid]: errorMessage,
                })}>
                <input ref={reference} {...properties} className={clsx(styles.input__field)} />
            </div>

            {errorMessage && errorMessage.trim().length > 0 && <p className={styles.input__error}>{errorMessage}</p>}
        </label>
    );
});

export default Input;
