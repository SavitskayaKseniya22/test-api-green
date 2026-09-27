import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";
import { selectCredentials, logout } from "../model/session-slice";

const responseSchema = z.object({
    error: z.string().optional(),
    message: z.string().optional(),
    description: z.string().optional(),
});

const rawBaseQuery = fetchBaseQuery({ baseUrl: "https://api.green-api.com", timeout: 15_000 });

export const baseQueryWithSession: typeof rawBaseQuery = async (arguments_, api, options) => {
    const credentials = selectCredentials(api.getState() as Parameters<typeof selectCredentials>[0]);
    const result = await rawBaseQuery(arguments_, api, options);

    if (!credentials || credentials !== selectCredentials(api.getState() as Parameters<typeof selectCredentials>[0])) {
        return result;
    }

    const error = result.error;
    if (!error) return result;
    const status = error?.status === "PARSING_ERROR" ? error.originalStatus : error?.status;
    const body = error.data;
    const parsed = responseSchema.safeParse(body);
    const message =
        typeof body === "string"
            ? body.trim()
            : parsed.success
              ? (parsed.data.error ?? parsed.data.message ?? parsed.data.description)
              : undefined;

    if (
        status === 401 ||
        (status === 403 && message === "Forbidden") ||
        (status === 400 && message === "instance is starting or not authorized")
    ) {
        api.dispatch(logout());
    }

    return result;
};
