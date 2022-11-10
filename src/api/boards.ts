import axiosInstance from "../axios";
import { store } from "../redux/store";

import error from "../components/ErrorDialog";
import success from "../components/SuccessDialog";

import { BoardType } from "../types";
import { receiveAllBoards } from "../redux/boardsSlice";

export const getBoard = (boardId: string | null, successCallback: (board: BoardType) => void = () => null) => {
  axiosInstance
    .get<BoardType>(`/boards/${boardId}`)
    .then((response) => {
      successCallback(response.data);
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't get board", err.response.data.message);
    });
};

export const getBoards = () => {
  axiosInstance
    .get<BoardType[]>(`/boards`)
    .then((response) => {
      const loggedUserId = localStorage.getItem("userId");
      store.dispatch(
        receiveAllBoards({
          owned: response.data.filter((board: BoardType) => board.owner?.identifier === loggedUserId),
          contributed: response.data.filter((board: BoardType) => board.owner?.identifier !== loggedUserId),
        })
      );
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't get boards", err.response.data.message);
    });
};

export const createBoard = (boardData: BoardType, successCallback: (boardId: string) => void) => {
  axiosInstance
    .post<BoardType>(`/boards`, boardData)
    .then((response) => {
      success("Board creation success", "New board created successfully.");
      if (response.data.identifier) successCallback(response.data.identifier); //TODO: opening board by default
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't create board", err.response.data.message);
    });
};

export const updateBoard = (boardData: BoardType, successCallback: (user: BoardType) => void, errorCallback: () => void) => {
  axiosInstance
    .patch<BoardType>(`/boards/${boardData.identifier}`, boardData)
    .then((response) => {
      successCallback(response.data);
      success("Board update success", "Your changed board data successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't update board", err.response.data.message);
      errorCallback();
    });
};

export const deleteBoard = (boardId: string | undefined, successCallback: () => void) => {
  axiosInstance
    .delete<BoardType>(`/boards/${boardId}`)
    .then(() => {
      successCallback();
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't delete board", err.response.data.message);
    });
};
