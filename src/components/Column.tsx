import { Space, Typography, Divider } from "antd";
import { ColumnType, TaskType } from "../types";
import TaskCard from "./TaskCard";

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

      {tasks.map((task: TaskType) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </Space>
  );
};

export default Column;
