import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import type { BoardType } from "../types";

interface BoardsState {
  contributed?: BoardType[];
  owned?: BoardType[];
}

const initialState: BoardsState = {
  contributed: [],
  owned: [],
};

export const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    receiveContributedBoards: (state, action: PayloadAction<BoardsState>) => {
      state.contributed = action.payload.contributed;
    },
    receiveOwnedBoards: (state, action: PayloadAction<BoardsState>) => {
      state.owned = action.payload.owned;
    },
    receiveAllBoards: (state, action: PayloadAction<BoardsState>) => {
      state.contributed = action.payload.contributed;
      state.owned = action.payload.owned;
    },
    clearBoards: (state) => {
      state.contributed = [];
      state.owned = [];
    },
    removeBoard: (state, action) => {
      state.owned = state.owned?.filter((board) => board.identifier !== action.payload);
    },
    addBoard: (state, action) => {
      state.owned = [...(state.owned || []), action.payload];
    },
    editBoard: (state, action) => {
      state.owned = state.owned?.map((board) => (board.identifier !== action.payload.identifier ? board : action.payload));
    },
  },
});

export const { receiveContributedBoards, receiveOwnedBoards, receiveAllBoards, clearBoards, removeBoard, addBoard, editBoard } =
  boardSlice.actions;

export const getContributed = (state: RootState) => state.boards.contributed;
export const getOwned = (state: RootState) => state.boards.owned;

export default boardSlice.reducer;
