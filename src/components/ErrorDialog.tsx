import { Modal } from "antd";

const error = (title: string, content: string) => {
  Modal.error({
    title,
    content,
  });
};

export default error;
