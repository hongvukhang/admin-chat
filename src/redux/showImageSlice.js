import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "images",
  initialState: {
    status: false,
    url: "",
  },
  reducers: {
    display: (state, action) => {
      state.status = true;
      state.url = action.payload;
    },
    notDisplay: (state) => {
      state.status = false;
      state.url = "";
    },
  },
});

export const { display, notDisplay } = imageSlice.actions;

export default imageSlice.reducer;
