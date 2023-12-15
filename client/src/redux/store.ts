import { configureStore } from "@reduxjs/toolkit/react";
import userReducer from "./reducers/user/userSlice";
import adminReducer from "./reducers/admin/adminSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    admin:adminReducer
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;