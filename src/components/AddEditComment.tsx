import { Button, Input } from "antd";

type AddEditCommentPropsType = {
  commentValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  editMode?: boolean;
};

const AddEditComment = ({ commentValue, onChange, onCancel, onSubmit, editMode = false }: AddEditCommentPropsType) => {
  return (
    <div className="add-edit-container">
      <Input value={commentValue} className="add-edit-input" onChange={onChange} placeholder="Wpisz treść komentarza" />
      <Button type="primary" onClick={onCancel} className="add-edit-btn">
        Anuluj
      </Button>
      <Button type="primary" onClick={onSubmit} className="add-edit-btn">
        {editMode ? "Edytuj" : "Dodaj"}
      </Button>
    </div>
  );
};

export default AddEditComment;
