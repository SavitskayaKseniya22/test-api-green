/* eslint-disable unicorn/prefer-spread */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/es/storage/session";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { sessionApi, sessionReducer } from "@/entities/session";
import { chatApi, chatsReducer } from "@/pages/main";

const rootReducer = combineReducers({
    session: sessionReducer,
    chats: chatsReducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
});

const persistedReducer = persistReducer({ key: "root", storage, whitelist: ["session", "chats"] }, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
        }).concat(sessionApi.middleware, chatApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
