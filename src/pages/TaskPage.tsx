import "../css/TaskPage.css";

import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, Space, Typography, Input, Button, Form, Select, Divider } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import { TaskType, ColumnType } from "../types";
import ConfirmModal from "../components/ConfirmModal";
import { getTask, createTask, updateTask, deleteTask, deleteAssignedUser, archiveTask } from "../api/tasks";
import { useAppSelector } from "../redux/hooks";
import { TASK_PRIORITY_MAP } from "../constants";
import Comments from "../components/Comments";
import { getBoard } from "../api/boards";

const { Title } = Typography;
const { TextArea } = Input;

type TaskPageProps = {
  create?: boolean;
};

const TaskPage = ({ create = false }: TaskPageProps) => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const board = useAppSelector((state) => state.tasks.board);

  const [task, setTask] = useState<null | TaskType>(null);
  const [editMode, setEditMode] = useState(create);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmArchiveModalOpen, setConfirmArchiveModalOpen] = useState(false);

  const [taskMainForm] = Form.useForm<{ title: string; description: string }>();
  const [taskExtraForm] = Form.useForm<{ assignee: string }>();
  const titleValue = Form.useWatch("title", taskMainForm);
  const descValue = Form.useWatch("description", taskMainForm);
  const assigneeValue = Form.useWatch("assignee", taskExtraForm);
  const priorityValue = Form.useWatch("priority", taskExtraForm);
  const loggedTime = Form.useWatch("loggedTime", taskExtraForm);

  useEffect(() => {
    getBoard(state.boardId);
    if (!create && id) {
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
      loggedTime: loggedTime,
    };
    if (assigneeValue) taskData["assignedUserIdentifier" as keyof typeof taskData] = assigneeValue;
    if (task?.identifier) {
      taskData["identifier" as keyof typeof taskData] = task.identifier;
      updateTask(taskData, (task) => {
        setTask(task);
        setEditMode(false);
      });
    } else {
      taskData["boardColumn" as keyof typeof taskData] = "TO_DO" as ColumnType;
      createTask(state.boardId, taskData, (taskId) => {
        navigate(`/tasks/${taskId}`, { state: { boardId: state.boardId } });
        setEditMode(false);
      });
    }
  };

  const goToBoard = () => {
    navigate(`/boards/${state.boardId}`);
  };

  const canSave = titleValue && descValue && priorityValue;

  const onCommentAdd = () => {
    if (id)
      getTask(id, (task) => {
        setTask(task);
      });
  };

  const clearUser = () => {
    if (task?.identifier)
      deleteAssignedUser(task?.identifier, (task) => {
        setTask(task);
      });
  };

  const openArchiveConfirmationModal = () => {
    setConfirmArchiveModalOpen(true);
  };

  const handleArchiveTask = () => {
    if (task) {
      setConfirmArchiveModalOpen(false);
      archiveTask(task.identifier, () => {
        navigate(`/boards/${state.boardId}`);
      });
    }
  };

  const cancelArchiveTask = () => {
    setConfirmArchiveModalOpen(false);
  };

  return (
    <Layout>
      <Layout.Content className="task-content">
        <Space className="task-header">
          <Button onClick={goToBoard} type="primary" className="btn-margin" size="large" disabled={!create && editMode}>
            Wróć do tablicy
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
                label="Tytuł zadania"
                name="title"
                rules={[{ required: true, message: "Tytuł zadania jest wymagany!" }]}
                initialValue={task?.title || ""}
              >
                <Input className="login-input" disabled={!editMode} />
              </Form.Item>
              <Form.Item
                label="Opis zadania"
                name="description"
                rules={[{ required: true, message: "Opis zadania jest wymagany!" }]}
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
                <Form.Item label="Numer zadania" name="number" initialValue={task?.taskNumber || ""}>
                  <Input className="login-input" disabled />
                </Form.Item>
              )}
              {!create && (
                <Form.Item
                  label="Zgłaszający"
                  name="reporter"
                  initialValue={task?.reporter ? `${task?.reporter.firstname} ${task?.reporter.surname}` : ""}
                >
                  <Input className="login-input" disabled />
                </Form.Item>
              )}
              {!create && (
                <Form.Item label="Data utworzenia" name="creationDate" initialValue={task?.creationDate}>
                  <Input className="login-input" disabled />
                </Form.Item>
              )}
              <div className="select-container">
                <Form.Item
                  label="Użytkownik"
                  name="assignee"
                  initialValue={task?.assignedUser ? task.assignedUser.identifier : ""}
                  className={editMode ? "select-edit" : "select-edit-closed"}
                >
                  <Select
                    showSearch
                    placeholder="Wybierz osobę"
                    optionFilterProp="children"
                    disabled={!editMode}
                    className="select"
                    filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                    options={[...(board?.contributors || []), board?.owner].map((user) => ({
                      value: user?.identifier,
                      label: `${user?.firstname} ${user?.surname}`,
                    }))}
                  />
                </Form.Item>
                {editMode && <Button onClick={clearUser} icon={<CloseOutlined />} type="primary" />}
              </div>
              <Form.Item label="Priorytet" name="priority" initialValue={task?.taskPriority || "LOWEST"}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={Object.entries(TASK_PRIORITY_MAP).map(([key, value]) => ({ value: key, label: value }))}
                  className="select"
                  disabled={!editMode}
                />
              </Form.Item>
              <Form.Item label="Wycena" name="loggedTime" initialValue={task?.loggedTime || ""}>
                <Input className="login-input" disabled={!editMode} type="number" />
              </Form.Item>
            </Form>
            <div className="task-tools">
              {editMode ? (
                <>
                  <Button onClick={cancelSave} className="btn-margin" size="large">
                    Anuluj
                  </Button>
                  <Button onClick={saveTask} type="primary" className="btn-margin" size="large" disabled={!canSave}>
                    Zapisz
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={openArchiveConfirmationModal} size="middle" type="primary">
                    Archiwizuj
                  </Button>
                  <Button onClick={openConfirmationModal} size="middle">
                    Usuń
                  </Button>
                  <Button onClick={openEditMode} type="primary" size="middle">
                    Edytuj
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
          title="Usuń zadanie"
          description="Ta akcja jest nieodwracalna. Czy na pewno chcesz usunąć to zadanie?"
        />
        <ConfirmModal
          open={confirmArchiveModalOpen}
          onOk={handleArchiveTask}
          onCancel={cancelArchiveTask}
          title="Archiwizuj zadanie"
          description="Ta akcja jest nieodwracalna. Czy na pewno chcesz archiwizować to zadanie?"
        />
      </Layout.Content>
    </Layout>
  );
};

export default TaskPage;
