import axiosInstance from "../axios/axios";
import { CommentType } from "../types";

import success from "../components/SuccessDialog";

export const createComment = (taskId: string, commentData: Pick<CommentType, "content">, successCallback: () => void) => {
  axiosInstance.post(`/tasks/${taskId}/comments`, commentData).then(() => {
    successCallback();
    success("Dodanie komentarza", "Pomyślnie dodano komentarz.");
  });
};

export const updateComment = (commentId: string, commentData: Pick<CommentType, "content">, successCallback: () => void) => {
  axiosInstance.patch(`/comments/${commentId}`, commentData).then(() => {
    successCallback();
    success("Edycja komentarza", "Pomyślnie zedytowano komentarz.");
  });
};

export const deleteComment = (commentId: string, successCallback: () => void) => {
  axiosInstance.delete(`/comments/${commentId}`).then(() => {
    successCallback();
    success("Usunięcie komentarza", "Pomyślnie usunięto komentarz.");
  });
};
