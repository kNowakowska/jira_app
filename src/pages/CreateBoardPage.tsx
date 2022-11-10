import "../css/CreateBoardPage.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, Input, Button, Form, Space, Typography, Col, Row } from "antd";
import ConfirmModal from "../components/ConfirmModal";
import { createBoard } from "../api/boards";

const { Title } = Typography;
const CreateBoardPage = () => {
  const navigate = useNavigate();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [form] = Form.useForm<{ shortcut: string; name: string }>();
  const shortcutValue = Form.useWatch("shortcut", form);
  const nameValue = Form.useWatch("name", form);

  const cancelSave = () => {
    setConfirmModalOpen(false);
    form.resetFields();
  };

  const cancelCancel = () => {
    setConfirmModalOpen(false);
  };

  const openCancelModal = () => {
    setConfirmModalOpen(true);
  };

  const goToBoard = (boardId: string) => {
    navigate(`/boards/${boardId}`);
  };

  const addBoard = () => {
    const boardData = {
      shortcut: shortcutValue,
      name: nameValue,
    };
    createBoard(boardData, goToBoard);
  };

  return (
    <Layout>
      <Layout.Content className="create-board-content">
        <Space>
          <Title level={3} className="page-title">
            Create new table
          </Title>
        </Space>
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          autoComplete="off"
          className="create-board-form"
          layout="inline"
          form={form}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Board shortcut"
                name="shortcut"
                rules={[{ required: true, message: "Please input board shortcut!" }]}
                initialValue=""
              >
                <Input className="login-input" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Board name"
                name="name"
                initialValue=""
                rules={[{ required: true, message: "Please input board name!" }]}
              >
                <Input className="login-input" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24} justify="center" style={{ marginTop: "30px" }}>
            <Col span={4}>
              <Button onClick={openCancelModal} size="large" className="btn-margin">
                Cancel
              </Button>
            </Col>
            <Col span={4}>
              <Button
                size="large"
                className="btn-margin"
                type="primary"
                htmlType="submit"
                onClick={addBoard}
                disabled={!shortcutValue || !nameValue}
              >
                Create
              </Button>
            </Col>
          </Row>
        </Form>
      </Layout.Content>
      <ConfirmModal
        open={confirmModalOpen}
        onOk={cancelSave}
        onCancel={cancelCancel}
        title="Cancel creating the board"
        description="Are you sure you want to cancel? You will lost all input data"
      />
    </Layout>
  );
};

export default CreateBoardPage;
