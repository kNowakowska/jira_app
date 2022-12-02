import axiosInstance from "../axios/axios";
import { CommentType } from "../types";

import error from "../components/ErrorDialog";
import success from "../components/SuccessDialog";

export const createComment = (taskId: string, commentData: Pick<CommentType, "content">, successCallback: () => void) => {
  axiosInstance
    .post(`/tasks/${taskId}/comments`, commentData)
    .then(() => {
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
    .then(() => {
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
    .then(() => {
      successCallback();
      success("Comment deletion success", "Comment deleted successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't delete comment", err.response.data.message);
    });
};
