import "./css/Comment.css";

import { ReactNode, useState } from "react";
import { CommentType } from "../types";

import { useAppSelector } from "../redux/hooks";

import { Comment } from "antd";
import ConfirmModal from "../components/ConfirmModal";
import AddEditComment from "../components/AddEditComment";

type CommentItemPropsType = {
  comment: CommentType;
  onEdit: (content: string) => void;
  onDelete: () => void;
};

const CommentItem = ({ comment, onEdit, onDelete }: CommentItemPropsType) => {
  const [confirmationModalOpen, setConfirmModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const loggedUser = useAppSelector((state) => state.system.user);

  const isAuthor = loggedUser?.identifier === comment.creator?.identifier;

  const openEditMode = () => {
    setEditMode(true);
  };
  const openConfirmModal = () => {
    setConfirmModalOpen(true);
  };

  const actions: ReactNode[] | undefined = isAuthor
    ? [
        <span key="comment-edit" onClick={openEditMode}>
          Edytuj
        </span>,
        <span key="comment-delete" onClick={openConfirmModal}>
          Usuń
        </span>,
      ]
    : [];

  const closeEditMode = () => {
    setEditMode(false);
  };

  const editComment = () => {
    onEdit(editedContent);
    setEditMode(false);
  };

  const handleCommentContentChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditedContent(e.target.value);

  const handleDeleteComment = () => {
    onDelete();
    setConfirmModalOpen(false);
  };

  const handleCancelCommentDeletion = () => setConfirmModalOpen(false);

  return (
    <>
      {editMode ? (
        <AddEditComment
          commentValue={editedContent}
          onChange={handleCommentContentChange}
          onCancel={closeEditMode}
          onSubmit={editComment}
        />
      ) : (
        <Comment
          actions={actions}
          author={comment.creator ? `${comment.creator?.firstname} ${comment.creator?.surname}` : ""}
          content={comment.content}
          // TODO: zmienić format createdDate
          datetime={<span>{comment.createdDate}</span>}
          className="comment"
        />
      )}
      {confirmationModalOpen && (
        <ConfirmModal
          open={confirmationModalOpen}
          onOk={handleDeleteComment}
          onCancel={handleCancelCommentDeletion}
          title="Delete comment"
          description="This action is permament. Are you sure you want to delete your comment?"
        />
      )}
    </>
  );
};

export default CommentItem;
