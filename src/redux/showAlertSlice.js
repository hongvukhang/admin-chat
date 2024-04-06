import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alert",
  initialState: {
    status: false,
    message: "some thing",
    close: { title: "navigate", payload: "/login" },
    actions: () => {},
    severity: "info",
  },
  reducers: {
    display: (state, action) => {
      state.status = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.actions = action.payload.action;
      state.close = action.payload.close;
    },
    notDisplay: (state) => {
      state.status = false;
    },
  },
});
export const { display, notDisplay } = alertSlice.actions;
export default alertSlice.reducer;
