import "./css/TaskCard.css";

import { Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";

import { Tooltip } from "antd";
import Card from "antd/lib/card/Card";
import { useAppSelector } from "../redux/hooks";

import { TaskType } from "../types";

type TaskPropsType = {
  task: TaskType;
  index: number;
};

const TaskCard: React.FC<TaskPropsType> = ({ task, index }: TaskPropsType) => {
  const boardId = useAppSelector((state) => state.tasks.board?.identifier);

  const assigneeComponent = () => {
    return (
      <span className="task-assignee">
        {task?.assignedUser ? `${task.assignedUser.firstname} ${task.assignedUser.surname}` : ""}
      </span>
    );
  };

  const cardTitle = () => {
    return (
      <Tooltip title="Open task" placement="bottom">
        <Link to={`/tasks/${task.identifier}`} state={{ boardId: boardId }}>
          {task.title}
        </Link>
      </Tooltip>
    );
  };
  return (
    <Draggable draggableId={task.identifier || ""} index={index}>
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
