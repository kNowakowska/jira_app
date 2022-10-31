import { Modal } from "antd";

type AssignedUsersModalPropsType = {
  open: boolean;
  onOk: () => void;
  onClose: () => void;
};

const AssignedUsersModal = ({ open, onOk, onClose }: AssignedUsersModalPropsType) => {
  return (
    <Modal title={"Assigned users"} open={open} onOk={onOk} onCancel={onClose}>
      <p>Assigned Users Modal</p>
    </Modal>
  );
};

export default AssignedUsersModal;
