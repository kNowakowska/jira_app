import { Space, Typography, Divider } from "antd";
import { ColumnType, TaskType } from "../types";
import TaskCard from "./TaskCard";
import { Droppable } from "react-beautiful-dnd";

import "./css/Column.css";

const { Title } = Typography;

type ColumnPropsType = {
  column: ColumnType;
  tasks: TaskType[];
};

const Column: React.FC<ColumnPropsType> = ({ column, tasks }: ColumnPropsType) => {
  return (
    <Space direction="vertical" size="middle" className="column-space">
      <Title level={3} className="column-title">
        {column.title}
      </Title>
      <Divider className="column-divider" />
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div className="droppable-space" ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task: TaskType, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Space>
  );
};

export default Column;
