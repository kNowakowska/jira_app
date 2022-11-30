import axiosInstance from "../axios";
import { CommentType } from "../types";

import { store } from "../redux/store";
import { addComment, editComment, removeComment } from "../redux/tasksSlice";

import error from "../components/ErrorDialog";
import success from "../components/SuccessDialog";

export const createComment = (taskId: string, commentData: Pick<CommentType, "content">, successCallback: () => void) => {
  axiosInstance
    .post(`/tasks/${taskId}/comments`, commentData)
    .then((response) => {
      //TODO: sprawdzić działanie store
      store.dispatch(addComment(response.data));
      successCallback();
      success("Comment creation success", "New comment created successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't create comment", err.response.data.message);
    });
};

export const updateComment = (commentId: string, commentData: Pick<CommentType, "content">, successCallback: () => void) => {
  axiosInstance
    .patch(`/comments/${commentId}`, commentData)
    .then((response) => {
      //TODO: sprawdzić działanie store
      store.dispatch(editComment(response.data));
      successCallback();
      success("Comment edit success", "Comment edited successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't edit comment", err.response.data.message);
    });
};

export const deleteComment = (commentId: string, successCallback: () => void) => {
  axiosInstance
    .delete(`/comments/${commentId}`)
    .then((response) => {
      //TODO: sprawdzić działanie store
      store.dispatch(removeComment(response.data));
      successCallback();
      success("Comment deletion success", "Comment deleted successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't delete comment", err.response.data.message);
    });
};
