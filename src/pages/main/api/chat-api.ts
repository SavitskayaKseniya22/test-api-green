import { createApi } from "@reduxjs/toolkit/query/react";
import { z } from "zod";
import { baseQueryWithSession, selectCredentials } from "@/entities/session";
import { messageAdded } from "../model/chats-slice";
import type { SessionCredentials } from "@/entities/session";
import { notificationSchema } from "../model/notification-schema";

interface SendMessageArguments {
    credentials: SessionCredentials;
    chatId: string;
    message: string;
}

const sendMessageResponseSchema = z.object({ idMessage: z.string().min(1) });

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: baseQueryWithSession,
    endpoints: builder => ({
        receiveNotification: builder.query<z.infer<typeof notificationSchema>, SessionCredentials>({
            async queryFn({ idInstance, apiTokenInstance }, _api, _options, baseQuery) {
                const result = await baseQuery({
                    url: `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
                    params: { receiveTimeout: 5 },
                });
                if (result.error) return { error: result.error };
                const parsed = notificationSchema.safeParse(result.data);
                return parsed.success
                    ? { data: parsed.data }
                    : { error: { status: "CUSTOM_ERROR", error: "Unexpected notification format" } };
            },
        }),
        deleteNotification: builder.mutation<{ result: boolean }, SessionCredentials & { receiptId: number }>({
            query: ({ idInstance, apiTokenInstance, receiptId }) => ({
                url: `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
                method: "DELETE",
            }),
        }),
        sendMessage: builder.mutation<z.infer<typeof sendMessageResponseSchema>, SendMessageArguments>({
            async queryFn({ credentials, chatId, message }, api, _options, baseQuery) {
                const session = selectCredentials(api.getState() as Parameters<typeof selectCredentials>[0]);
                const { idInstance, apiTokenInstance } = credentials;
                const result = await baseQuery({
                    url: `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
                    method: "POST",
                    body: { chatId, message },
                });

                if (result.error) return { error: result.error };

                const parsed = sendMessageResponseSchema.safeParse(result.data);
                if (!parsed.success) {
                    return { error: { status: "CUSTOM_ERROR", error: "Unexpected GREEN-API response" } };
                }
                if (
                    session &&
                    session === selectCredentials(api.getState() as Parameters<typeof selectCredentials>[0])
                ) {
                    api.dispatch(
                        messageAdded({
                            phone: `+${chatId.replace(/@c\.us$/, "")}`,
                            message: {
                                id: parsed.data.idMessage,
                                text: message,
                                timestamp: Date.now(),
                                direction: "outgoing",
                            },
                        }),
                    );
                }
                return { data: parsed.data };
            },
        }),
    }),
});

export const { useSendMessageMutation, useLazyReceiveNotificationQuery, useDeleteNotificationMutation } = chatApi;
