import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "../css/TaskList.css";

import { Layout, Space, Typography, List, Button } from "antd";

import { getBoard } from "../api/boards";
import { useAppSelector } from "../redux/hooks";
import { getTasks } from "../api/tasks";
import { TaskType } from "../types";
import { Link } from "react-router-dom";

const { Title } = Typography;

type TaskListProps = {
  archived?: boolean;
};

const TasksList = ({ archived }: TaskListProps) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const board = useAppSelector((state) => state.tasks.board);
  const allTasks = useAppSelector((state) => state.tasks.tasks);
  const archivedTasks = useAppSelector((state) => state.tasks.archivedTasks);

  useEffect(() => {
    getBoard(state.boardId, (board) => {
      getTasks(board);
    });
  }, [state]);

  const goToBoard = () => {
    navigate(`/boards/${state.boardId}`);
  };

  return (
    <Layout>
      <Layout.Content className="tasks-list-content">
        <Space className="title-container">
          <Button onClick={goToBoard} type="primary" className="btn-margin" size="middle">
            Wróć do tablicy
          </Button>
          <Title level={3} className="page-title">
            {board?.name || ""}
          </Title>
        </Space>
        <List
          itemLayout="horizontal"
          dataSource={archived ? archivedTasks : allTasks}
          renderItem={(item: TaskType) => (
            <List.Item key={item.identifier} className="task-item">
              <List.Item.Meta
                title={
                  <Link to={`/tasks/${item.identifier}`} state={{ boardId: board?.identifier }}>
                    {item.title}
                  </Link>
                }
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Layout.Content>
    </Layout>
  );
};

export default TasksList;
