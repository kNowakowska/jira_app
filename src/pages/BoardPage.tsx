import "../css/BoardPage.css";

import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Layout, Button, Space, Typography } from "antd";

import Column from "../components/Column";
import ConfirmModal from "../components/ConfirmModal";
import EditBoardModal from "../components/EditBoardModal";
import AssignedUsersModal from "../components/AssignedUsersModal";
import { BoardType, DroppableColumnType, TaskType } from "../types";
import { getBoard, updateBoard, deleteBoard } from "../api/boards";
import { changeTaskOrder, changeTaskStatus, getTasks } from "../api/tasks";
import { COLUMN_TYPE_MAP } from "../constants";

const { Title } = Typography;

export const columnOrder = ["TO_DO", "IN_PROGRESS", "READY_FOR_TESTING", "TESTING", "DONE"];

const BoardPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [board, setBoard] = useState<BoardType | null>(null);
  const [columns, setColumns] = useState<DroppableColumnType>(
    Object.entries(COLUMN_TYPE_MAP).reduce((acc: DroppableColumnType, [key, value]) => {
      acc[key as keyof typeof acc] = { id: key, title: value, taskIds: [] };
      return acc;
    }, {})
  );
  const [editBoard, setEditBoard] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [usersModalOpen, setUsersModalOpen] = useState(false);

  useEffect(() => {
    retrieveBoard();
  }, [id]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = columns[source.droppableId as keyof typeof columns];
    const finish = columns[destination.droppableId as keyof typeof columns];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds || []);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      if (board?.identifier)
        changeTaskOrder(board?.identifier, draggableId, { positionInColumn: destination.index + 1 }, () => {
          setColumns({ ...columns, [newColumn?.id]: newColumn });
        });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    if (board?.identifier)
      changeTaskStatus(
        board?.identifier,
        draggableId,
        { positionInColumn: destination.index + 1, newTaskColumn: finish.id },
        () => {
          setColumns({ ...columns, [newStart.id]: newStart, [newFinish.id]: newFinish });
        }
      );
  };

  const openEditBoardModal = () => {
    setEditBoard(true);
  };

  const closeEditBoardModal = () => {
    setEditBoard(false);
  };

  const editBoardHandler = (newBoardName: string) => {
    const newBoardData = {
      name: newBoardName,
      shortcut: board?.shortcut,
      identifier: board?.identifier,
    };
    //TODO: przetestować, brak endpointu
    updateBoard(newBoardData, () => {
      setEditBoard(false);
      retrieveBoard();
    });
  };

  const openConfirmationModal = () => {
    setConfirmModalOpen(true);
  };

  const removeBoard = () => {
    deleteBoard(board?.identifier, () => {
      navigate("/");
    });
  };

  const cancelDeleteBoard = () => {
    setConfirmModalOpen(false);
  };

  const openUsersModal = () => {
    setUsersModalOpen(true);
  };

  const closeUsersModal = () => {
    setUsersModalOpen(false);
  };

  const retrieveBoard = () => {
    //TODO: do usunięcia, będzie podmianka w reduxie
    getBoard(id, (board) => {
      getTasks(board);
      setBoard(board);
      setColumns((prevCol) =>
        Object.keys(COLUMN_TYPE_MAP).reduce((acc, column) => {
          acc[column as keyof typeof acc] = {
            ...acc[column as keyof typeof acc],
            taskIds: (board.tasks || [])
              .filter((task) => task.boardColumn === column)
              .sort((task) => task?.orderInColumn || 0)
              .map((task) => task?.identifier || ""),
          };
          return acc;
        }, prevCol)
      );
    });
  };

  const isOwner = localStorage.getItem("userId") === board?.owner?.identifier;

  const goToCreateTaskPage = () => {
    navigate("/tasks/new_task", { state: { boardId: board?.identifier } });
  };

  return (
    <Layout>
      <Layout.Content className="board-content">
        <Space className="title-container">
          <Title level={3} className="page-title">
            {board?.name || ""}
          </Title>
        </Space>
        <div className="board-container">
          <div className="board-main">
            <DragDropContext onDragEnd={onDragEnd}>
              {columnOrder.map((columnId: string) => {
                const column = columns[columnId as keyof typeof columns];
                const tasks = (board?.tasks || []).filter(
                  (task: TaskType) => task?.identifier && column.taskIds.includes(task.identifier)
                );

                return <Column key={column.id} column={column} tasks={tasks} />;
              })}
            </DragDropContext>
          </div>
          <div className="board-side-toolbar">
            {isOwner && (
              <Button type="primary" size="large" onClick={openEditBoardModal} className="action-btn">
                Edit board
              </Button>
            )}
            {isOwner && (
              <Button size="large" onClick={openConfirmationModal} className="action-btn">
                Delete board
              </Button>
            )}
            <Button type="primary" size="large" onClick={openUsersModal} className="action-btn">
              Assigned users
            </Button>
            <Button type="primary" size="large" onClick={goToCreateTaskPage} className="action-btn">
              Add task
            </Button>
          </div>
        </div>
      </Layout.Content>
      <ConfirmModal
        open={confirmModalOpen}
        onOk={removeBoard}
        onCancel={cancelDeleteBoard}
        title="Delete board"
        description="This action is permament. Are you sure you want to delete this board?"
      />
      <EditBoardModal open={editBoard} onOk={editBoardHandler} onCancel={closeEditBoardModal} boardName={board?.name || ""} />
      <AssignedUsersModal
        open={usersModalOpen}
        onOk={closeUsersModal}
        onClose={closeUsersModal}
        isOwner={isOwner}
        boardId={board?.identifier}
        contributors={board?.contributors || []}
        onChange={retrieveBoard}
      />
    </Layout>
  );
};

export default BoardPage;
