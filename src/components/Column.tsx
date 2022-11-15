import { Space, Typography, Divider } from "antd";
import { TaskType, columnTypeMap, ColumnDefinitionType } from "../types";
import TaskCard from "./TaskCard";
import { Droppable } from "react-beautiful-dnd";

import "./css/Column.css";

const { Title } = Typography;

type ColumnPropsType = {
  column: ColumnDefinitionType;
  tasks: TaskType[];
};

const Column: React.FC<ColumnPropsType> = ({ column, tasks }: ColumnPropsType) => {
  return (
    <Space direction="vertical" size="middle" className="column-space">
      <Title level={3} className="column-title">
        {columnTypeMap[column.id as keyof typeof columnTypeMap]}
      </Title>
      <Divider className="column-divider" />
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div className="droppable-space" ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task: TaskType, index) => (
              <TaskCard key={task.identifier} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Space>
  );
};

export default Column;
