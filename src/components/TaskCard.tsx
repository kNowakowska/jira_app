import "./css/TaskCard.css";

import { Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";

import { Tooltip } from "antd";
import Card from "antd/lib/card/Card";

import { TaskType } from "../types";

type TaskPropsType = {
  task: TaskType;
  index: number;
};

const TaskCard: React.FC<TaskPropsType> = ({ task, index }: TaskPropsType) => {
  const assigneeComponent = () => {
    return <span className="task-assignee">{task.assignee || ""}</span>;
  };

  const cardTitle = () => {
    return (
      <Tooltip title="Open task" placement="bottom">
        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
      </Tooltip>
    );
  };
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title={cardTitle()}
          extra={assigneeComponent()}
          size="small"
          className="task-card"
        >
          {task.description}
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;
