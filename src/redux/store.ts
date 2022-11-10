import { configureStore } from "@reduxjs/toolkit";
import systemReducer from "./systemSlice";
import boardReducer from "./boardsSlice";

export const store = configureStore({
  reducer: {
    system: systemReducer,
    boards: boardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
