import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: !!localStorage.getItem('token'), // Check if the user is logged in based on the presence of the token
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
    //   localStorage.setItem('userInfo', JSON.stringify(action.payload)); // Save user info to local storage
    },
    clearUser: (state) => {
      state.userInfo = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
       localStorage.removeItem('userId');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;