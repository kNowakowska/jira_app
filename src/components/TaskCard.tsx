import Card from "antd/lib/card/Card";
import { TaskType } from "../types";

import "./css/TaskCard.css";

type TaskPropsType = {
  task: TaskType;
};

const TaskCard: React.FC<TaskPropsType> = () => {
  return (
    <Card title="Card" size="small" className="task-card">
      <p>Card content</p>
    </Card>
  );
};

export default TaskCard;
