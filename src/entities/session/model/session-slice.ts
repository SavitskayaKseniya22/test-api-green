import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { SessionCredentials } from "./session-schema";

interface SessionState {
    credentials: SessionCredentials | null;
}

const initialState: SessionState = { credentials: null };

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<SessionCredentials>) {
            state.credentials = action.payload;
        },
        logout(state) {
            state.credentials = null;
        },
    },
    selectors: {
        selectIsAuthenticated: state => state.credentials !== null,
        selectCredentials: state => state.credentials,
    },
});

export const sessionReducer = sessionSlice.reducer;
export const { setCredentials, logout } = sessionSlice.actions;
export const { selectIsAuthenticated, selectCredentials } = sessionSlice.selectors;
