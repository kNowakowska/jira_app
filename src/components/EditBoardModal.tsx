import { Modal, Form, Input } from "antd";
import { useEffect } from "react";

type EditBoardModalPropsType = {
  open: boolean;
  onOk: (newValue: string) => void;
  onCancel: () => void;
  boardName: string;
};

const EditBoardModal = ({ open, onOk, onCancel, boardName }: EditBoardModalPropsType) => {
  const [form] = Form.useForm<{ name: string }>();
  const nameValue = Form.useWatch("name", form);

  useEffect(() => {
    form.resetFields();
  }, [open]);

  const editBoard = () => {
    onOk(nameValue);
    form.resetFields();
  };

  return (
    <Modal
      title="Edytuj tablicę"
      open={open}
      onOk={editBoard}
      onCancel={onCancel}
      okButtonProps={{ disabled: nameValue === boardName || !nameValue }}
      cancelText="Anuluj"
    >
      <Form
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        autoComplete="off"
        className="edit-board-form"
        layout="inline"
        form={form}
      >
        <Form.Item
          label="Nazwa tablicy"
          name="name"
          rules={[{ required: true, message: "Nazwa tablicy się wymagana!" }]}
          initialValue={boardName}
        >
          <Input className="login-input" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBoardModal;
