import "../css/TaskPage.css";

import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, Space, Typography, Input, Button, Form, Select, Divider } from "antd";

import { TaskType, ColumnType } from "../types";
import ConfirmModal from "../components/ConfirmModal";
import { getTask, createTask, updateTask, deleteTask } from "../api/tasks";
import { useAppSelector } from "../redux/hooks";
import { TASK_PRIORITY_MAP } from "../constants";
import Comments from "../components/Comments";

const { Title } = Typography;
const { TextArea } = Input;

type TaskPageProps = {
  create?: boolean;
};

const TaskPage = ({ create = false }: TaskPageProps) => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const users = useAppSelector((state) => state.users.users);

  const [task, setTask] = useState<null | TaskType>(null);
  const [editMode, setEditMode] = useState(create);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [taskMainForm] = Form.useForm<{ title: string; description: string }>();
  const [taskExtraForm] = Form.useForm<{ assignee: string }>();
  const titleValue = Form.useWatch("title", taskMainForm);
  const descValue = Form.useWatch("description", taskMainForm);
  // const assigneeValue = Form.useWatch("assignee", taskExtraForm);
  const priorityValue = Form.useWatch("priority", taskExtraForm);

  useEffect(() => {
    if (!create) {
      getTask(id, (task) => {
        setTask(task);
      });
    }
  }, [id]);

  useEffect(() => {
    taskMainForm.resetFields();
    taskExtraForm.resetFields();
  }, [task]);

  const cancelSave = () => {
    if (create) {
      goToBoard();
    }
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

  const handleDeleteTask = () => {
    if (task) {
      setConfirmModalOpen(false);
      deleteTask(task.identifier, () => {
        navigate(`/boards/${state.boardId}`);
      });
    }
  };

  const cancelDeleteTask = () => {
    setConfirmModalOpen(false);
  };

  const saveTask = () => {
    const taskData = {
      title: titleValue,
      description: descValue,
      taskPriority: priorityValue,
    };
    // if (assigneeValue) taskData["assignedUserIdentifier" as keyof typeof taskData] = assigneeValue;
    //TODO: nie dziala przekazanie assignee
    if (task?.identifier) {
      taskData["identifier" as keyof typeof taskData] = task.identifier;
      updateTask(taskData, (task) => {
        setTask(task);
        setEditMode(false);
      });
    } else {
      taskData["boardColumn" as keyof typeof taskData] = "TO_DO" as ColumnType;
      createTask(state.boardId, taskData, (taskId) => {
        setEditMode(false);
        navigate(`/tasks/${taskId}`, { state: { boardId: state.boardId } });
      });
    }
  };

  const goToBoard = () => {
    navigate(`/boards/${state.boardId}`);
  };

  const canSave = titleValue && descValue && priorityValue;

  const onCommentAdd = () => {
    getTask(id, (task) => {
      setTask(task);
    });
  };

  return (
    <Layout>
      <Layout.Content className="task-content">
        <Space className="task-header">
          <Button onClick={goToBoard} type="primary" className="btn-margin" size="large" disabled={editMode}>
            Go back to board
          </Button>
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

            <Divider className="task-page-divider" />

            <div className="task-comments">
              <Title level={4} className="task-comments-title">
                KOMENTARZE
              </Title>
              {task?.identifier && <Comments taskId={task?.identifier} onAdd={onCommentAdd} comments={task?.comments || []} />}
            </div>
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
              {!create && (
                <Form.Item
                  label="Task number"
                  name="number"
                  rules={[{ required: true, message: "Please input task number!" }]}
                  initialValue={task?.taskNumber || ""}
                >
                  <Input className="login-input" disabled />
                </Form.Item>
              )}
              {!create && (
                <Form.Item
                  label="Reporter"
                  name="reporter"
                  initialValue={task?.reporter ? `${task?.reporter.firstname} ${task?.reporter.surname}` : ""}
                >
                  <Input className="login-input" disabled />
                </Form.Item>
              )}
              {!create && (
                <Form.Item label="Creation date" name="creationDate" initialValue={task?.creationDate}>
                  <Input className="login-input" disabled />
                </Form.Item>
              )}
              <Form.Item
                label="Assignee"
                name="assignee"
                initialValue={task?.assignedUser ? `${task?.assignedUser.firstname} ${task?.assignedUser.surname}` : ""}
              >
                <Select
                  showSearch
                  placeholder="Wybierz osobę"
                  optionFilterProp="children"
                  disabled={!editMode}
                  className="select"
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={users.map((user) => ({ value: user.identifier, label: `${user.firstname} ${user.surname}` }))}
                />
              </Form.Item>
              <Form.Item label="Priority" name="priority" initialValue={task?.taskPriority || "LOWEST"}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={Object.entries(TASK_PRIORITY_MAP).map(([key, value]) => ({ value: key, label: value }))}
                  className="select"
                  disabled={!editMode}
                />
              </Form.Item>
            </Form>
            <div className="task-tools">
              {editMode ? (
                <>
                  <Button onClick={cancelSave} className="btn-margin" size="large">
                    Cancel
                  </Button>
                  <Button onClick={saveTask} type="primary" className="btn-margin" size="large" disabled={!canSave}>
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
            </div>
          </div>
        </Space>
        <ConfirmModal
          open={confirmModalOpen}
          onOk={handleDeleteTask}
          onCancel={cancelDeleteTask}
          title="Delete task"
          description="This action is permament. Are you sure you want to delete this task?"
        />
      </Layout.Content>
    </Layout>
  );
};

export default TaskPage;
