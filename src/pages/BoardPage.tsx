import "../css/BoardPage.css";

import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Layout, Button, Space, Typography } from "antd";

import { initialTasks, initialColumns, columnOrder, board as initialBoard } from "../data";
import Column from "../components/Column";
import ConfirmModal from "../components/ConfirmModal";
import EditBoardModal from "../components/EditBoardModal";
import AssignedUsersModal from "../components/AssignedUsersModal";
import { BoardType } from "../types";

const { Title } = Typography;

const BoardPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [board, setBoard] = useState<BoardType | null>(null);
  const [columns, setColumns] = useState(initialColumns);
  const [editBoard, setEditBoard] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [usersModalOpen, setUsersModalOpen] = useState(false);

  useEffect(() => {
    setBoard(initialBoard);
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
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      setColumns({ ...columns, [newColumn.id]: newColumn });
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

    setColumns({ ...columns, [newStart.id]: newStart, [newFinish.id]: newFinish });
  };

  const openEditBoardModal = () => {
    setEditBoard(true);
  };

  const closeEditBoardModal = () => {
    setEditBoard(false);
  };

  const updateBoard = (newBoardName: string) => {
    console.log(newBoardName);
    setEditBoard(false);
  };

  const openConfirmationModal = () => {
    setConfirmModalOpen(true);
  };

  const deleteBoard = () => {
    navigate("/");
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
                const tasks = column.taskIds.map((taskId: string) => initialTasks[taskId as keyof typeof initialTasks]);

                return <Column key={column.id} column={column} tasks={tasks} />;
              })}
            </DragDropContext>
          </div>
          <div className="board-side-toolbar">
            <Button type="primary" size="large" onClick={openEditBoardModal} className="action-btn">
              Edit board
            </Button>
            <Button size="large" onClick={openConfirmationModal} className="action-btn">
              Delete board
            </Button>
            <Button type="primary" size="large" onClick={openUsersModal} className="action-btn">
              Assigned users
            </Button>
          </div>
        </div>
      </Layout.Content>
      <ConfirmModal
        open={confirmModalOpen}
        onOk={deleteBoard}
        onCancel={cancelDeleteBoard}
        title="Delete board"
        description="This action is permament. Are you sure you want to delete this board?"
      />
      <EditBoardModal open={editBoard} onOk={updateBoard} onCancel={closeEditBoardModal} boardName={board?.name || ""} />
      <AssignedUsersModal open={usersModalOpen} onOk={closeUsersModal} onClose={closeUsersModal} />
    </Layout>
  );
};

export default BoardPage;
