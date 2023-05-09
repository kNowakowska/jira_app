import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { UserType } from "../types";

interface SystemState {
  user: UserType | null;
  isLogged: boolean;
  githubUrl: string;
}

const initialState: SystemState = {
  isLogged: false,
  user: null,
  githubUrl: "",
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
    setGithubUrl: (state, action) => {
      state.githubUrl = action.payload;
    },
  },
});

export const { logIn, logOut, setGithubUrl } = systemSlice.actions;

export const getLoggedUser = (state: RootState) => state.system.user;
export const getIsLogged = (state: RootState) => state.system.isLogged;

export default systemSlice.reducer;
