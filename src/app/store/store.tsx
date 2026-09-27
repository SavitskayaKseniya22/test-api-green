/* eslint-disable unicorn/prefer-spread */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { sessionApi, sessionReducer } from "@/entities/session";

const rootReducer = combineReducers({ session: sessionReducer, [sessionApi.reducerPath]: sessionApi.reducer });

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sessionApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
