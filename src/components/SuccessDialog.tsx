import { Modal } from "antd";

const success = (title: string, content: string) => {
  Modal.success({
    title,
    content,
  });
};

export default success;
