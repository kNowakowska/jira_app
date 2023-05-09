import { Modal } from "antd";

type ConfirmModalPropsType = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  title: string;
  description: string;
};
const ConfirmModal = ({ open, onOk, onCancel, title, description }: ConfirmModalPropsType) => {
  return (
    <Modal title={title} open={open} onOk={onOk} onCancel={onCancel} cancelText="Anuluj">
      <p>{description}</p>
    </Modal>
  );
};

export default ConfirmModal;
