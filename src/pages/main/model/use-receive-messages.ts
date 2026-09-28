import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCredentials } from "@/entities/session";
import { useLazyReceiveNotificationQuery, useDeleteNotificationMutation } from "../api/chat-api";
import { messageWebhookTypes, textMessageSchema } from "./notification-schema";
import { messageAdded } from "./chats-slice";

export function useReceiveMessages() {
    const credentials = useSelector(selectCredentials);
    const dispatch = useDispatch();
    const [receive] = useLazyReceiveNotificationQuery();
    const [remove] = useDeleteNotificationMutation();
    const [error, setError] = useState("");

    useEffect(() => {
        if (!credentials) return;

        let stopped = false;
        let timer: ReturnType<typeof setTimeout>;
        let request: { abort: () => void } | undefined;

        const poll = () => {
            const receiving = receive(credentials);
            request = receiving;
            return receiving
                .unwrap()
                .then(notification => {
                    if (stopped) return;
                    if (!notification) return 250;
                    if (notification) {
                        const { body } = notification;
                        const isTextMessage = ["textMessage", "extendedTextMessage", "quotedMessage"].includes(
                            body.messageData?.typeMessage ?? "",
                        );
                        if (messageWebhookTypes.includes(body.typeWebhook) && isTextMessage) {
                            const parsed = textMessageSchema.safeParse(body);
                            if (!parsed.success) {
                                setError(
                                    "Не удалось разобрать текстовое сообщение. Получение остановлено, уведомление оставлено в очереди.",
                                );
                                return;
                            }
                            const { senderData, messageData, idMessage, timestamp, typeWebhook } = parsed.data;
                            dispatch(
                                messageAdded({
                                    phone: `+${senderData.chatId.replace(/@c\.us$/, "")}`,
                                    message: {
                                        id: idMessage,
                                        text:
                                            "textMessageData" in messageData
                                                ? messageData.textMessageData.textMessage
                                                : messageData.extendedTextMessageData.text,
                                        timestamp: timestamp * 1000,
                                        direction: typeWebhook === "incomingMessageReceived" ? "incoming" : "outgoing",
                                    },
                                }),
                            );
                        }

                        const deleting = remove({ ...credentials, receiptId: notification.receiptId });
                        request = deleting;
                        return deleting.unwrap().then(confirmation => {
                            if (!confirmation.result)
                                throw new Error("GREEN-API не подтвердил удаление уведомления из очереди.");
                            return 0;
                        });
                    }
                })
                .then(delay => {
                    if (stopped || delay === undefined) return;
                    setError("");
                    return delay;
                })
                .catch((error_: unknown) => {
                    if (stopped) return;
                    setError(
                        error_ instanceof Error
                            ? `${error_.message} Повторяем через 5 секунд.`
                            : "Ошибка запроса GREEN-API при получении или подтверждении уведомления. Повторяем через 5 секунд.",
                    );
                    return 5000;
                })
                .then(delay => {
                    if (stopped || delay === undefined) return;
                    timer = setTimeout(() => {
                        void poll();
                    }, delay);
                });
        };

        timer = setTimeout(() => {
            void poll();
        }, 0);
        return () => {
            stopped = true;
            clearTimeout(timer);
            request?.abort();
        };
    }, [credentials, dispatch, receive, remove]);

    return error;
}
