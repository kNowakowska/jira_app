import "../css/BoardPage.css";

import { Layout } from "antd";
import { initialTasks, initialColumns, columnOrder } from "../data";
import Column from "../components/Column";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useState } from "react";

const HomePage: React.FC = () => {
  const [columns, setColumns] = useState(initialColumns);
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
  return (
    <Layout>
      <Layout.Content className="board-content">
        <DragDropContext onDragEnd={onDragEnd}>
          {columnOrder.map((columnId: string) => {
            const column = columns[columnId as keyof typeof columns];
            const tasks = column.taskIds.map((taskId: string) => initialTasks[taskId as keyof typeof initialTasks]);

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </DragDropContext>
      </Layout.Content>
    </Layout>
  );
};

export default HomePage;
