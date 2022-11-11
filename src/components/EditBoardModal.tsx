import { Modal, Form, Input } from "antd";

type EditBoardModalPropsType = {
  open: boolean;
  onOk: (newValue: string) => void;
  onCancel: () => void;
  boardName: string;
};

const EditBoardModal = ({ open, onOk, onCancel, boardName }: EditBoardModalPropsType) => {
  const [form] = Form.useForm<{ name: string }>();
  const nameValue = Form.useWatch("name", form);

  const editBoard = () => {
    onOk(nameValue);
    form.resetFields();
  };

  return (
    <Modal
      title={"Edit board"}
      open={open}
      onOk={editBoard}
      onCancel={onCancel}
      okButtonProps={{ disabled: nameValue === boardName }}
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
          label="Board name"
          name="name"
          rules={[{ required: true, message: "Please input board name!" }]}
          initialValue={boardName}
        >
          <Input className="login-input" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBoardModal;
