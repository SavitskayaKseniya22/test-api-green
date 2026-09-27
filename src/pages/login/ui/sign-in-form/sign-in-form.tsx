import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionCredentialsSchema, setCredentials, useLazyGetStateInstanceQuery } from "@/entities/session";
import type { SessionCredentials } from "@/entities/session";
import styles from "./sign-in-form.module.scss";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

const stateMessages: Record<string, string> = {
    notAuthorized: "Привяжите WhatsApp к инстансу в кабинете GREEN-API и повторите подключение.",
    starting: "Инстанс запускается. Подождите немного и повторите подключение.",
    blocked: "Инстанс заблокирован. Проверьте его состояние в кабинете GREEN-API.",
    suspended: "На аккаунте действуют ограничения. Проверьте их в кабинете GREEN-API.",
};

export function SignInForm() {
    const dispatch = useDispatch();
    const [getStateInstance] = useLazyGetStateInstanceQuery();
    const [message, setMessage] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SessionCredentials>({
        resolver: zodResolver(sessionCredentialsSchema),
        defaultValues: { idInstance: "", apiTokenInstance: "" },
    });

    const submit = async (credentials: SessionCredentials) => {
        setMessage("");

        try {
            const response = await getStateInstance(credentials).unwrap();
            if (response.stateInstance !== "authorized") {
                setMessage(
                    stateMessages[response.stateInstance] ??
                        "Инстанс пока не готов к работе. Проверьте его в кабинете GREEN-API.",
                );
                return;
            }
            dispatch(setCredentials(credentials));
        } catch (error: unknown) {
            const status = typeof error === "object" && error !== null && "status" in error ? error.status : undefined;
            setMessage(
                status === 401 || status === 403
                    ? "Доступ отклонён. Проверьте idInstance и apiTokenInstance."
                    : status === "FETCH_ERROR" || status === "TIMEOUT_ERROR"
                      ? "Не удалось связаться с GREEN-API. Проверьте соединение и повторите попытку."
                      : status === 429
                        ? "Слишком много запросов. Подождите и повторите попытку."
                        : "Не удалось проверить подключение. Проверьте реквизиты и повторите попытку.",
            );
        }
    };

    return (
        <form
            className={styles.form}
            onSubmit={event => {
                void handleSubmit(submit)(event);
            }}
            noValidate>
            <Input
                label={"idInstance"}
                inputMode="numeric"
                aria-invalid={!!errors.idInstance}
                aria-describedby="instance-error"
                errorMessage={errors.idInstance?.message}
                {...register("idInstance")}
                disabled={isSubmitting}
            />

            <Input
                label={"apiTokenInstance"}
                type="password"
                autoComplete="off"
                aria-invalid={!!errors.apiTokenInstance}
                aria-describedby="token-error"
                {...register("apiTokenInstance")}
                errorMessage={errors.apiTokenInstance?.message}
                disabled={isSubmitting}
            />
            <Button type="submit" view="secondary">
                {isSubmitting ? "Проверяем подключение…" : "Подключиться"}
            </Button>

            {message && (
                <p role="status" className={styles.form__error}>
                    {message}
                </p>
            )}
        </form>
    );
}
