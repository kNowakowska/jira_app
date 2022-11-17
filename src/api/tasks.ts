import axiosInstance from "../axios";
import { store } from "../redux/store";

import error from "../components/ErrorDialog";
import success from "../components/SuccessDialog";

import { TaskType } from "../types";
import { addTask, editTask, removeTask, receiveTasks } from "../redux/tasksSlice";

export const getTasks = (boardId: string, successCallback: (task: TaskType) => void = () => null) => {
  axiosInstance
    .get<TaskType>(`/boards/${boardId}/tasks`)
    .then((response) => {
      store.dispatch(receiveTasks({ boardId: boardId, tasks: response.data || [] }));
      successCallback(response.data);
    })
    .catch((err) => {
      //TODO: store do usunięcia na przyszłość
      store.dispatch(receiveTasks({ boardId: boardId, tasks: [] }));
      console.error(err.message);
      // error("Couldn't get tasks", err.response.data.message);
    });
};

export const getTask = (taskId: string | undefined, successCallback: (task: TaskType) => void = () => null) => {
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

export const createTask = (boardId: string, taskData: TaskType, successCallback: (taskId: string) => void) => {
  axiosInstance
    .post(`/boards/${boardId}/tasks`, taskData)
    .then((response) => {
      //TODO: sprawdzić działanie store
      store.dispatch(addTask(response.data));
      if (response.data) successCallback(response.data?.identifier);
      success("Task creation success", "New task created successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't create task", err.response.data.message);
    });
};

export const updateTask = (taskData: TaskType, successCallback: (task: TaskType) => void) => {
  axiosInstance
    .patch<TaskType>(`/tasks/${taskData.identifier}`, taskData)
    .then((response) => {
      store.dispatch(editTask(response.data));
      //TODO: sprawdzić działanie store
      successCallback(response.data);
      success("Task update success", "Your changed task data successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't update task", err.response.data.message);
    });
};

export const deleteTask = (taskId: string | undefined, successCallback: () => void) => {
  axiosInstance
    .delete<TaskType>(`/tasks/${taskId}`)
    .then(() => {
      store.dispatch(removeTask(taskId));
      //TODO: sprawdzić działanie store
      successCallback();
      success("Task deletion", "Task deleted successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't delete task", err.response.data.message);
    });
};
