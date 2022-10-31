import "../css/TaskPage.css";

import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, Space, Typography, Input, Button, Form } from "antd";

import { TaskType } from "../types";
import ConfirmModal from "../components/ConfirmModal";
import { initialTasks } from "../data";

const { Title } = Typography;
const { TextArea } = Input;

const TaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<null | TaskType>(null);
  const [editMode, setEditMode] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [taskMainForm] = Form.useForm<{ title: string; description: string }>();
  const [taskExtraForm] = Form.useForm<{ assignee: string }>();

  useEffect(() => {
    setTask(id && id in initialTasks ? initialTasks[id as keyof typeof initialTasks] : null);
  }, [id]);

  useEffect(() => {
    taskMainForm.resetFields();
    taskExtraForm.resetFields();
  }, [task]);

  const cancelSave = () => {
    setEditMode(false);
    taskMainForm.resetFields();
    taskExtraForm.resetFields();
  };

  const openEditMode = () => {
    setEditMode(true);
  };

  const openConfirmationModal = () => {
    setConfirmModalOpen(true);
  };

  const deleteTask = () => {
    if (task) navigate(`/boards/${task?.board}`);
  };

  const cancelDeleteTask = () => {
    setConfirmModalOpen(false);
  };

  const saveTask = () => {
    setEditMode(false);
  };

  return (
    <Layout>
      <Layout.Content className="task-content">
        <Space>
          <Title level={3} className="page-title">
            {task?.title || ""}
          </Title>
        </Space>
        <Space className="task-main-content">
          <div className="task-main">
            <Form
              name="task-main"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              autoComplete="off"
              className="edit-task-form"
              layout="vertical"
              form={taskMainForm}
            >
              <Form.Item
                label="Task title"
                name="title"
                rules={[{ required: true, message: "Please input task title!" }]}
                initialValue={task?.title || ""}
              >
                <Input className="login-input" disabled={!editMode} />
              </Form.Item>
              <Form.Item
                label="Task description"
                name="description"
                rules={[{ required: true, message: "Please input task description!" }]}
                initialValue={task?.description || ""}
              >
                <TextArea className="login-input" disabled={!editMode} rows={5} />
              </Form.Item>
            </Form>
          </div>
          <div className="task-actions">
            <Form
              name="task-extra"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              autoComplete="off"
              className="edit-task-form"
              layout="vertical"
              form={taskExtraForm}
            >
              <Form.Item
                label="Task number"
                name="number"
                rules={[{ required: true, message: "Please input task number!" }]}
                initialValue={task?.id || ""}
              >
                <Input className="login-input" disabled />
              </Form.Item>
              <Form.Item label="Assignee" name="assignee" initialValue={task?.assignee || ""}>
                <Input className="login-input" disabled={!editMode} />
              </Form.Item>
              <Form.Item label="Reporter" name="reporter" initialValue={task?.reporter || ""}>
                <Input className="login-input" disabled />
              </Form.Item>
            </Form>
          </div>
        </Space>
        <Space className="task-tools">
          {editMode ? (
            <>
              <Button onClick={cancelSave} className="btn-margin" size="large">
                Cancel
              </Button>
              <Button onClick={saveTask} type="primary" className="btn-margin" size="large">
                Save
              </Button>
            </>
          ) : (
            <>
              <Button onClick={openConfirmationModal} className="btn-margin" size="large">
                Delete
              </Button>
              <Button onClick={openEditMode} type="primary" className="btn-margin" size="large">
                Edit
              </Button>
            </>
          )}
        </Space>
        <ConfirmModal
          open={confirmModalOpen}
          onOk={deleteTask}
          onCancel={cancelDeleteTask}
          title="Delete task"
          description="This action is permament. Are you sure you want to delete this task?"
        />
      </Layout.Content>
    </Layout>
  );
};

export default TaskPage;
