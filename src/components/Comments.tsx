import "./css/Comments.css";

import { useState } from "react";

import { Tooltip, Button } from "antd";
import { PlusCircleTwoTone } from "@ant-design/icons";

import Comment from "../components/Comment";
import AddEditComment from "../components/AddEditComment";

import { CommentType } from "../types";
import { deleteComment, updateComment, createComment } from "../api/comments";

type CommentsPropsType = {
  taskId: string;
  onAdd: () => void;
  comments: CommentType[];
  readOnly?: boolean;
};

const Comments = ({ taskId, onAdd, comments, readOnly = false }: CommentsPropsType) => {
  const [addMode, setAddMode] = useState(false);
  const [newComment, setNewComment] = useState("");

  const openAddMode = () => {
    setAddMode(true);
  };

  const addComment = () => {
    const commentData: Pick<CommentType, "content"> = { content: newComment };
    createComment(taskId, commentData, () => {
      onAdd();
      setAddMode(false);
      setNewComment("");
    });
  };

  const closeAddMode = () => {
    setAddMode(false);
    setNewComment("");
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId, () => {
      onAdd();
    });
  };

  const handleEditComment = (commentId: string, content: string) => {
    const commentData: Pick<CommentType, "content"> = {
      content,
    };
    updateComment(commentId, commentData, () => {
      onAdd();
    });
  };

  const handleCommentContentChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value);

  return (
    <>
      {!readOnly &&
        (addMode ? (
          <AddEditComment
            commentValue={newComment}
            onChange={handleCommentContentChange}
            onCancel={closeAddMode}
            onSubmit={addComment}
          />
        ) : (
          <div className="add-comment-section">
            <Tooltip title="Dodaj komentarz" placement="bottom">
              <Button shape="circle" icon={<PlusCircleTwoTone onClick={openAddMode} />} className="add-comment-btn" />
            </Tooltip>
          </div>
        ))}
      {comments.map((comment) => (
        <Comment
          comment={comment}
          key={comment.identifier}
          onEdit={(content) => handleEditComment(comment.identifier || "", content)}
          onDelete={() => handleDeleteComment(comment.identifier || "")}
        />
      ))}
    </>
  );
};

export default Comments;
