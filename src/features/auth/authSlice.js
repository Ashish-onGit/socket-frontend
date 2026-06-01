import { createSlice } from '@reduxjs/toolkit';
import { loadUserFromStorage } from '../../utils/localStorage';

const initialState = {
  user: loadUserFromStorage() || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      // Setup default bio and initials details if not exist
      state.user = {
        bio: "Hey there! I am using SocketChat.",
        ...action.payload
      };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
});

export const { loginSuccess, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
