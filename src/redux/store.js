import { configureStore } from "@reduxjs/toolkit";
import showImageReducer from "./showImageSlice";
import socketReducer from "./socketSlice";

import showAlertSlice from "./showAlertSlice";
export default configureStore({
  reducer: {
    show_image: showImageReducer,
    socket: socketReducer,
    show_alert: showAlertSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
