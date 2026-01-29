import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/AppSlice";

export const store = configureStore({
  reducer: {
    app: appReducer
  },
});
