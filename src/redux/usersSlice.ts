import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import type { UserType } from "../types";

interface UsersState {
  users: UserType[];
}

const initialState: UsersState = {
  users: [],
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    receiveUsers: (state, action) => {
      state.users = action.payload;
    },
    editUser: (state, action) => {
      state.users = state.users.map((user) => (user.identifier !== action.payload.identifier ? user : action.payload));
    },
  },
});

export const { receiveUsers, editUser } = userSlice.actions;

export const getUsers = (state: RootState) => state.users;

export default userSlice.reducer;
