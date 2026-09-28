import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logout } from "@/entities/session";
import type { ChatMessage } from "./message";

interface ChatsState {
    phones: string[];
    activePhone: string | null;
    messages: Record<string, ChatMessage[]>;
}

const initialState: ChatsState = { phones: [], activePhone: null, messages: {} };

const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        messageAdded(state, action: PayloadAction<{ phone: string; message: ChatMessage }>) {
            const { phone, message } = action.payload;
            if (!state.phones.includes(phone)) state.phones.push(phone);
            state.messages ??= {};
            const messages = (state.messages[phone] ??= []);
            if (!messages.some(item => item.id === message.id)) messages.push(message);
        },
        addChat(state, action: PayloadAction<string>) {
            if (!state.phones.includes(action.payload)) state.phones.push(action.payload);
            state.activePhone = action.payload;
        },
        selectChat(state, action: PayloadAction<string>) {
            if (state.phones.includes(action.payload)) state.activePhone = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(logout, () => initialState);
    },
    selectors: {
        selectChatPhones: state => state.phones,
        selectActivePhone: state => state.activePhone,
        selectMessages: state => state.messages,
    },
});

export const chatsReducer = chatsSlice.reducer;
export const { addChat, selectChat, messageAdded } = chatsSlice.actions;
export const { selectChatPhones, selectActivePhone, selectMessages } = chatsSlice.selectors;
