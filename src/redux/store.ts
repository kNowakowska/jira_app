import { configureStore } from "@reduxjs/toolkit";
import systemReducer from "./systemSlice";
import boardReducer from "./boardsSlice";
import taskReducer from "./tasksSlice";
import userReducer from "./usersSlice";

export const store = configureStore({
  reducer: {
    system: systemReducer,
    boards: boardReducer,
    tasks: taskReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
