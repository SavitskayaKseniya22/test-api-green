import { z } from "zod";

export const notificationSchema = z
    .object({
        receiptId: z.number(),
        body: z.looseObject({
            typeWebhook: z.string(),
            messageData: z.looseObject({ typeMessage: z.string() }).optional(),
        }),
    })
    .nullable();

export const messageWebhookTypes = ["incomingMessageReceived", "outgoingMessageReceived", "outgoingAPIMessageReceived"];

export const textMessageSchema = z.object({
    typeWebhook: z.string(),
    idMessage: z.string(),
    timestamp: z.number(),
    senderData: z.object({ chatId: z.string() }),
    messageData: z.union([
        z.object({ textMessageData: z.object({ textMessage: z.string() }) }),
        z.object({ extendedTextMessageData: z.object({ text: z.string() }) }),
    ]),
});
