import axiosInstance from "../axios/axios";
import { store } from "../redux/store";

import success from "../components/SuccessDialog";

import { BoardType } from "../types";
import { receiveAllBoards, removeBoard, addBoard, editBoard } from "../redux/boardsSlice";
import { setBoard } from "../redux/tasksSlice";

export const getBoard = (boardId: string, successCallback: (board: BoardType) => void = () => null) => {
  axiosInstance.get<BoardType>(`/boards/${boardId}`).then((response) => {
    successCallback(response.data);
    store.dispatch(setBoard(response.data));
  });
};

export const getBoards = () => {
  axiosInstance.get<BoardType[]>(`/boards`).then((response) => {
    const loggedUserId = localStorage.getItem("userId");
    store.dispatch(
      receiveAllBoards({
        owned: response.data.filter((board: BoardType) => board.owner?.identifier === loggedUserId),
        contributed: response.data.filter((board: BoardType) => board.owner?.identifier !== loggedUserId),
      })
    );
  });
};

export const createBoard = (boardData: Partial<BoardType>, successCallback: (boardId: string) => void) => {
  axiosInstance.post<BoardType>(`/boards`, boardData).then((response) => {
    store.dispatch(addBoard(response.data));
    if (response.data.identifier) successCallback(response.data.identifier);
    success("Utworzenie tablicy", "Utworzenie nowej tablicy zakończyło sie sukcesem.");
  });
};

export const updateBoard = (boardData: Partial<BoardType>, successCallback: (board: BoardType) => void) => {
  axiosInstance.put<BoardType>(`/boards/${boardData.identifier}`, boardData).then((response) => {
    store.dispatch(editBoard(response.data));
    successCallback(response.data);
    success("Edycja tablicy", "Edycja tablicy zakończyła sie sukcesem.");
  });
};

export const deleteBoard = (boardId: string, successCallback: () => void) => {
  axiosInstance.delete<BoardType>(`/boards/${boardId}`).then(() => {
    store.dispatch(removeBoard(boardId));
    successCallback();
    success("Usunięcie tablicy", "Usunięcie tablicy zakończyło sie sukcesem.");
  });
};

export const addContributor = (boardId: string, userId: string, successCallback: () => void) => {
  axiosInstance.put<BoardType>(`/boards/${boardId}/users/${userId}`).then(() => {
    successCallback();
    success("Edycja tablicy", "Edycja tablicy zakończyła sie sukcesem.");
  });
};

export const deleteContributor = (boardId: string, userId: string, successCallback: () => void) => {
  axiosInstance.delete<BoardType>(`/boards/${boardId}/users/${userId}`).then(() => {
    successCallback();
    success("Edycja tablicy", "Edycja tablicy zakończyła sie sukcesem.");
  });
};
