import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import type { BoardType, TaskType } from "../types";

interface TasksState {
  tasks: TaskType[];
  board: BoardType | null;
  search: string;
  assignedUserIdentifier: string;
  filteredTasks: TaskType[];
}

const initialState: TasksState = {
  tasks: [],
  board: null,
  search: "",
  assignedUserIdentifier: "",
  filteredTasks: [],
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    receiveTasks: (state, action) => {
      if (state.search === "" && state.assignedUserIdentifier === "") {
        state.tasks = action.payload.tasks;
      }
      state.filteredTasks = action.payload.tasks;
      state.board = { ...action.payload.board };
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.filteredTasks = [];
      state.board = null;
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks?.filter((task) => task.identifier !== action.payload);
      state.filteredTasks = state.filteredTasks.filter((task) => task.identifier !== action.payload);
    },
    addTask: (state, action) => {
      state.tasks = [...(state.tasks || []), action.payload];
      state.filteredTasks = [...(state.filteredTasks || []), action.payload];
    },
    editTask: (state, action) => {
      state.tasks = state.tasks?.map((task) => (task.identifier !== action.payload.identifier ? task : action.payload));
      state.filteredTasks = state.filteredTasks?.map((task) =>
        task.identifier !== action.payload.identifier ? task : action.payload
      );
    },
    searchPhrase: (state, action) => {
      state.search = action.payload;
    },
    filterUser: (state, action) => {
      state.assignedUserIdentifier = action.payload;
    },
    setBoard: (state, action) => {
      state.board = action.payload;
    },
  },
});

export const { receiveTasks, clearTasks, removeTask, addTask, editTask, searchPhrase, filterUser, setBoard } =
  taskSlice.actions;

export const getTasks = (state: RootState) => state.tasks.tasks;
export const getBoard = (state: RootState) => state.tasks.board;
export const getSearch = (state: RootState) => state.tasks.search;
export const getAssignedUser = (state: RootState) => state.tasks.assignedUserIdentifier;

export default taskSlice.reducer;
