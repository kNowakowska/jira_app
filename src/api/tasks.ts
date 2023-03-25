import axiosInstance from "../axios/axios";
import { store } from "../redux/store";

import success from "../components/SuccessDialog";

import { BoardType, TaskType, ChangeTaskStatusRequestType } from "../types";
import { addTask, editTask, removeTask, receiveTasks, getBoard, getSearch, getAssignedUser } from "../redux/tasksSlice";

export const getTasks = (board: BoardType, successCallback: (tasks: TaskType[]) => void = () => null) => {
  const search = getSearch(store.getState());
  const assignedUser = getAssignedUser(store.getState());

  axiosInstance
    .get<TaskType[]>(`/boards/${board.identifier}/tasks/?search=${search}&assignedUserIdentifier=${assignedUser}`)
    .then((response) => {
      store.dispatch(receiveTasks({ board: board, tasks: response.data || [] }));
      successCallback(response.data);
    });
};

export const getTask = (taskId: string, successCallback: (task: TaskType) => void = () => null) => {
  axiosInstance.get<TaskType>(`/tasks/${taskId}`).then((response) => {
    successCallback(response.data);
  });
};

export const createTask = (boardId: string, taskData: Partial<TaskType>, successCallback: (taskId: string) => void) => {
  axiosInstance.post(`/boards/${boardId}/tasks`, taskData).then((response) => {
    store.dispatch(addTask(response.data));
    if (response.data) successCallback(response.data?.identifier);
    success("Utworzenie zadania", "Utworzenie nowego zadania powiodło się.");
  });
};

export const updateTask = (taskData: Partial<TaskType>, successCallback: (task: TaskType) => void) => {
  axiosInstance.patch<TaskType>(`/tasks/${taskData.identifier}`, taskData).then((response) => {
    store.dispatch(editTask(response.data));
    successCallback(response.data);
    success("Edycja zadania", "Edycja zadania powiodła się.");
  });
};

export const deleteTask = (taskId: string, successCallback: () => void) => {
  axiosInstance.delete<TaskType>(`/tasks/${taskId}`).then(() => {
    store.dispatch(removeTask(taskId));
    successCallback();
    success("Usunięcie zadania", "Usunięcie zadania powiodło się.");
  });
};

export const changeTaskStatus = (
  taskId: string,
  changeStatusData: ChangeTaskStatusRequestType,
  successCallback: (tasks: TaskType[]) => void
) =>
  axiosInstance.put(`/tasks/${taskId}/columns`, changeStatusData).then(() => {
    const board = getBoard(store.getState());
    if (board) {
      getTasks(board, successCallback);
    }
  });

export const changeTaskOrder = (
  taskId: string,
  changeOrderData: ChangeTaskStatusRequestType,
  successCallback: (tasks: TaskType[]) => void
) =>
  axiosInstance.put(`/tasks/${taskId}/order`, changeOrderData).then(() => {
    const board = getBoard(store.getState());
    if (board) {
      getTasks(board, successCallback);
    }
  });

export const logTime = (taskId: string, value: number, successCallback: (task: TaskType) => void) =>
  axiosInstance.put(`/tasks/${taskId}/log-time`, { loggedTime: value }).then((response) => {
    successCallback(response.data);
    success("Logowanie czasu", "Logowanie czasu powiodło się.");
  });

export const deleteAssignedUser = (taskId: string, successCallback: (task: TaskType) => void) =>
  axiosInstance.delete(`/tasks/${taskId}/assigned-user`).then((response) => {
    successCallback(response.data);
    success("Usunięcie przypisanego użytkownika", "Usunięcie przypisanego użytkownika powiodło się.");
  });

export const archiveTask = (taskId: string, successCallback: () => void) => {
  axiosInstance.put<TaskType>(`/tasks/${taskId}/archive`).then(() => {
    store.dispatch(removeTask(taskId));
    successCallback();
    success("Archiwizacja zadania", "Archiwizacja zadania powiodło się.");
  });
};
