import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import type { TaskType } from "../types";

interface TasksState {
  tasks: TaskType[];
  boardId: string;
}

const initialState: TasksState = {
  tasks: [],
  boardId: "",
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    receiveTasks: (state, action) => {
      state.tasks = action.payload.tasks;
      state.boardId = action.payload.boardId;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.boardId = "";
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks?.filter((task) => task.identifier !== action.payload);
    },
    addTask: (state, action) => {
      state.tasks = [...(state.tasks || []), action.payload];
    },
    editTask: (state, action) => {
      state.tasks = state.tasks?.map((task) => (task.identifier !== action.payload.identifier ? task : action.payload));
    },
    addComment: (state, action) => {
      console.log(state, action);
    },
    editComment: (state, action) => {
      console.log(state, action);
    },
    removeComment: (state, action) => {
      console.log(state, action);
    },
  },
});

export const { receiveTasks, clearTasks, removeTask, addTask, editTask, addComment, editComment, removeComment } =
  taskSlice.actions;

export const getTasks = (state: RootState) => state.tasks;

export default taskSlice.reducer;
