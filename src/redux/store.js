import { configureStore } from "@reduxjs/toolkit";
import showImageReducer from "./showImageSlice";
import socketReducer from "./socketSlice";
export default configureStore({
  reducer: {
    show_image: showImageReducer,
    socket: socketReducer,
  },
});
