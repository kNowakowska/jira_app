import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { UserType } from "../types";

interface SystemState {
  user: UserType | null;
  isLogged: boolean;
}

const initialState: SystemState = {
  isLogged: false,
  user: null,
};

export const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    logOut: (state) => {
      state.isLogged = false;
      state.user = null;
    },
    logIn: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      state.isLogged = true;
    },
  },
});

export const { logIn, logOut } = systemSlice.actions;

export const getLoggedUser = (state: RootState) => state.system.user;
export const getIsLogged = (state: RootState) => state.system.isLogged;

export default systemSlice.reducer;
