import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// const chatSlice = createSlice({
//   name: "chat",
//   initialState: {
//     messages: [], // will hold full message objects
//   },
//   reducers: {
//     addMessage: (state, action) => {
//       // action.payload = full message object:
//       // {
//       //   message,
//       //   sender,
//       //   fromSelf,
//       //   replyTo: { message, sender } | null,
//       //   id?, timestamp?,
//       // }
//       state.messages.push(action.payload);
//     },

//     clearMessages: (state) => {
//       state.messages = [];
//     },
//   },
// });

// export const { addMessage, clearMessages } = chatSlice.actions;
// export default chatSlice.reducer;