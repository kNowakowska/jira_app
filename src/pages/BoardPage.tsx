import "../css/BoardPage.css";

import { DragDropContext, DropResult } from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";

import { Layout, Button, Space, Typography, AutoComplete, Radio } from "antd";

import Column from "../components/Column";
import ConfirmModal from "../components/ConfirmModal";
import EditBoardModal from "../components/EditBoardModal";
import AssignedUsersModal from "../components/AssignedUsersModal";
import { BoardType, DroppableColumnType, TaskType } from "../types";
import { getBoard, updateBoard, deleteBoard } from "../api/boards";
import { changeTaskOrder, changeTaskStatus, getTasks } from "../api/tasks";
import { searchPhrase, filterUser } from "../redux/tasksSlice";
import { COLUMN_TYPE_MAP } from "../constants";
import { DeleteOutlined, EditFilled, PlusCircleOutlined, UnorderedListOutlined, UsergroupAddOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const COLUMN_ORDER = ["TO_DO", "IN_PROGRESS", "READY_FOR_TESTING", "TESTING", "DONE"];

const BoardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const allTasks = useAppSelector((state) => state.tasks.tasks);
  const filteredTasks = useAppSelector((state) => state.tasks.filteredTasks);

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
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    retrieveBoard();
  }, [id, searchValue, selectedUser]);

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
      setColumns({ ...columns, [newColumn?.id]: newColumn });
      if (board?.identifier) {
        changeTaskOrder(draggableId, { positionInColumn: destination.index }, createColumnsObj);
      }
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

    if (board?.identifier)
      changeTaskStatus(draggableId, { positionInColumn: destination.index, newTaskColumn: finish.id }, createColumnsObj);
  };

  const openEditBoardModal = () => {
    clearFilters();
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
    updateBoard(newBoardData, (updatedBoard) => {
      setBoard(updatedBoard);
      setEditBoard(false);
    });
  };

  const openConfirmationModal = () => {
    clearFilters();
    setConfirmModalOpen(true);
  };

  const removeBoard = () => {
    if (board)
      deleteBoard(board.identifier, () => {
        navigate("/");
      });
  };

  const cancelDeleteBoard = () => {
    setConfirmModalOpen(false);
  };

  const openUsersModal = () => {
    clearFilters();
    setUsersModalOpen(true);
  };

  const closeUsersModal = () => {
    setUsersModalOpen(false);
  };

  const retrieveBoard = () => {
    if (id)
      getBoard(id, (board) => {
        getTasks(board, createColumnsObj);
        setBoard(board);
      });
  };

  const createColumnsObj = (tasks: TaskType[]) => {
    setColumns((prevCol) =>
      Object.keys(COLUMN_TYPE_MAP).reduce(
        (acc, column) => {
          acc[column as keyof typeof acc] = {
            ...acc[column as keyof typeof acc],
            taskIds: (tasks || [])
              .filter((task) => task.boardColumn === column)
              .sort((task1, task2) =>
                task1?.orderInColumn === undefined || task2?.orderInColumn === undefined
                  ? 0
                  : task1?.orderInColumn - task2?.orderInColumn
              )
              .map((task) => task?.identifier || ""),
          };
          return acc;
        },
        { ...prevCol }
      )
    );
  };

  const isOwner = localStorage.getItem("userId") === board?.owner?.identifier;

  const goToCreateTaskPage = () => {
    clearFilters();
    navigate("/tasks/new_task", { state: { boardId: board?.identifier } });
  };

  const unselectRadioBtn = (e: React.MouseEvent<HTMLInputElement>) => {
    const clickedBtn = e.target as HTMLInputElement;
    if (clickedBtn.type === "radio" && selectedUser === clickedBtn.value) {
      setSelectedUser("");
      dispatch(filterUser(""));
    }
  };

  const clearFilters = () => {
    setSearchValue("");
    setSelectedUser("");
    dispatch(filterUser(""));
    dispatch(searchPhrase(""));
  };

  const gotoTasksList = () => {
    clearFilters();
    navigate("/tasks", { state: { boardId: board?.identifier } });
  };

  return (
    <Layout>
      <Layout.Content className="board-content">
        <Space className="title-container">
          <Title level={3} className="page-title">
            {board?.name || ""}
          </Title>
        </Space>
        <div onClick={unselectRadioBtn}>
          <Radio.Group
            className="users-filters-sections"
            buttonStyle="solid"
            value={selectedUser}
            onChange={(e) => {
              setSelectedUser(e.target.value);
              dispatch(filterUser(e.target.value));
            }}
          >
            <Radio.Button value={board?.owner.identifier} key={board?.owner.identifier} className="user-filter-btn">
              {board?.owner.firstname}
            </Radio.Button>
            {board?.contributors?.map((user) => (
              <Radio.Button value={user.identifier} key={user.identifier} className="user-filter-btn">
                {user.firstname}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <div className="board-container">
          <div className="board-main">
            <DragDropContext onDragEnd={onDragEnd}>
              {COLUMN_ORDER.map((columnId: string) => {
                const column = columns[columnId as keyof typeof columns];
                const tasks: TaskType[] = [];
                column.taskIds.forEach((taskId) => {
                  const task = filteredTasks.find((task) => task.identifier === taskId);
                  if (task) {
                    tasks.push(task);
                  }
                });

                return <Column key={column.id} column={column} tasks={tasks} />;
              })}
            </DragDropContext>
          </div>
          <div className="board-side-toolbar">
            <AutoComplete
              placeholder="Wyszukaj"
              className="action-btn"
              options={allTasks.map((task) => ({ value: task.taskNumber, label: task.taskNumber }))}
              filterOption={(inputValue, option) => option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              onSelect={(value: string) => {
                setSearchValue(value);
                dispatch(searchPhrase(value));
              }}
              onClear={() => {
                setSearchValue("");
                dispatch(searchPhrase(""));
              }}
              allowClear
              value={searchValue}
            />
            {isOwner && (
              <Button type="primary" size="large" onClick={openEditBoardModal} className="action-btn">
                Edytuj tablicę <EditFilled />
              </Button>
            )}
            {isOwner && (
              <Button size="large" onClick={openConfirmationModal} className="action-btn secondary">
                Usuń tablicę <DeleteOutlined />
              </Button>
            )}
            <Button type="primary" size="large" onClick={openUsersModal} className="action-btn">
              Użytkownicy <UsergroupAddOutlined />
            </Button>
            <Button type="primary" size="large" onClick={goToCreateTaskPage} className="action-btn">
              Dodaj zadanie <PlusCircleOutlined />
            </Button>
            <Button type="primary" size="large" onClick={gotoTasksList} className="action-btn">
              Wszystkie zadania <UnorderedListOutlined />
            </Button>
          </div>
        </div>
      </Layout.Content>
      <ConfirmModal
        open={confirmModalOpen}
        onOk={removeBoard}
        onCancel={cancelDeleteBoard}
        title="Usuń tablicę"
        description="Ta akcja jest nieodwracalna. Czy na pewno chcesz usunąć tą tablicę?"
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
