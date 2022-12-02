import axiosInstance from "../axios";
import { store } from "../redux/store";

import error from "../components/ErrorDialog";
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
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't get tasks", err.response.data.message);
    });
};

export const getTask = (taskId: string, successCallback: (task: TaskType) => void = () => null) => {
  axiosInstance
    .get<TaskType>(`/tasks/${taskId}`)
    .then((response) => {
      successCallback(response.data);
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't get task", err.response.data.message);
    });
};

export const createTask = (boardId: string, taskData: Partial<TaskType>, successCallback: (taskId: string) => void) => {
  axiosInstance
    .post(`/boards/${boardId}/tasks`, taskData)
    .then((response) => {
      store.dispatch(addTask(response.data));
      if (response.data) successCallback(response.data?.identifier);
      success("Task creation success", "New task created successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't create task", err.response.data.message);
    });
};

export const updateTask = (taskData: Partial<TaskType>, successCallback: (task: TaskType) => void) => {
  axiosInstance
    .patch<TaskType>(`/tasks/${taskData.identifier}`, taskData)
    .then((response) => {
      store.dispatch(editTask(response.data));
      successCallback(response.data);
      success("Task update success", "Your changed task data successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't update task", err.response.data.message);
    });
};

export const deleteTask = (taskId: string, successCallback: () => void) => {
  axiosInstance
    .delete<TaskType>(`/tasks/${taskId}`)
    .then(() => {
      store.dispatch(removeTask(taskId));
      successCallback();
      success("Task deletion", "Task deleted successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't delete task", err.response.data.message);
    });
};

export const changeTaskStatus = (
  taskId: string,
  changeStatusData: ChangeTaskStatusRequestType,
  successCallback: (tasks: TaskType[]) => void
) =>
  axiosInstance
    .put(`/tasks/${taskId}/columns`, changeStatusData)
    .then(() => {
      const board = getBoard(store.getState());
      if (board) {
        getTasks(board, successCallback);
      }
      //TODO: sprawdzić działanie store
    })
    .catch((err) => {
      console.error(err.message);
      error("Error when changing status of task", err.response.data.message);
    });

export const changeTaskOrder = (
  taskId: string,
  changeOrderData: ChangeTaskStatusRequestType,
  successCallback: (tasks: TaskType[]) => void
) =>
  axiosInstance
    .put(`/tasks/${taskId}/order`, changeOrderData)
    .then(() => {
      const board = getBoard(store.getState());
      if (board) {
        getTasks(board, successCallback);
      }
      //TODO: sprawdzić działanie store
    })
    .catch((err) => {
      console.error(err.message);
      error("Error when changing order of task", err.response.data.message);
    });
