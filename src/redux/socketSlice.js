import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: { socket: null, message: null },
  reducers: {
    saveSocket: (state, action) => {
      state = { ...state, socket: action.payload };
    },
    saveMessage: (state, action) => {
      state = { ...state, message: action.payload };
    },
  },
});

export const { saveSocket, saveMessage } = socketSlice.actions;

export default socketSlice.reducer;
