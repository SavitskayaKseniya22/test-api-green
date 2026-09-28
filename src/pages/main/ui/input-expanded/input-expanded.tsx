import styles from "./input.module.scss";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { clsx } from "clsx";
import { Button } from "@/shared/ui/button";
import { useSelector } from "react-redux";
import { useSendMessageMutation } from "../../api/chat-api";
import { selectCredentials } from "@/entities/session";

const formSchema = z.object({
    text: z.string().trim().min(1, "Введите сообщение").max(20_000, "Сообщение слишком длинное"),
});

export default function InputExpanded({ phone }: { phone: string }) {
    const credentials = useSelector(selectCredentials);
    const [sendMessage] = useSendMessageMutation();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { text: "" } });

    const textareaReference = useRef<HTMLDivElement>(null);
    const [sendError, setSendError] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    const formWatch = useWatch({ name: "text", control });

    const onSubmit = ({ text }: z.infer<typeof formSchema>) => {
        setSendError(false);

        if (!credentials) {
            setSendError(true);
            return;
        }

        return sendMessage({ credentials, chatId: `${phone.replace(/^\+/, "")}@c.us`, message: text })
            .unwrap()
            .then(() => {
                reset();
                setIsEmpty(true);
                if (textareaReference.current) {
                    textareaReference.current.textContent = "";
                    textareaReference.current.focus();
                }
            })
            .catch(() => {
                setSendError(true);
            });
    };

    return (
        <>
            {(errors.text || sendError) && (
                <p role="status" className={styles.field__error}>
                    {errors.text?.message ?? "Не удалось подтвердить отправку. Проверьте чат перед повторной попыткой."}
                </p>
            )}
            <form
                onSubmit={event => {
                    void handleSubmit(onSubmit)(event);
                }}
                className={styles.field__inputs}>
                <div
                    ref={textareaReference}
                    contentEditable={isSubmitting ? false : "plaintext-only"}
                    suppressContentEditableWarning
                    role="textbox"
                    tabIndex={0}
                    onInput={() => {
                        const text = textareaReference.current?.textContent ?? "";
                        setValue("text", text, { shouldDirty: true });
                        setIsEmpty(text.trim().length === 0);
                    }}
                    onKeyDown={event => {
                        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                            event.preventDefault();
                            if (!isSubmitting) {
                                void handleSubmit(onSubmit)();
                            }
                        }
                    }}
                    className={clsx(styles.field__input, {
                        [styles[`field__input--placeholder`]]: isEmpty,
                    })}
                    data-placeholder="Ваше сообщение..."
                />
                <Button
                    size="small"
                    view="secondary"
                    type="submit"
                    disabled={isSubmitting || formWatch.trim().length === 0}>
                    {isSubmitting ? "Отправляем…" : "Отправить"}
                </Button>
                <input type="hidden" {...register("text")} />
            </form>
        </>
    );
}
