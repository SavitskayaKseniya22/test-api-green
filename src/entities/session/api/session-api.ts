import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { instanceStateSchema } from "../model/session-schema";
import type { InstanceState, SessionCredentials } from "../model/session-schema";

export const sessionApi = createApi({
    reducerPath: "sessionApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://api.green-api.com", timeout: 15_000 }),
    endpoints: builder => ({
        getStateInstance: builder.query<InstanceState, SessionCredentials>({
            async queryFn({ idInstance, apiTokenInstance }, _api, _options, baseQuery) {
                const result = await baseQuery({
                    url: `/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
                });

                if (result.error) return { error: result.error };

                const parsed = instanceStateSchema.safeParse(result.data);
                if (!parsed.success) {
                    return { error: { status: "CUSTOM_ERROR", error: "Unexpected GREEN-API response" } };
                }
                return { data: parsed.data };
            },
        }),
    }),
});

export const { useLazyGetStateInstanceQuery } = sessionApi;
