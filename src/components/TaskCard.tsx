import "./css/TaskCard.css";

import { Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";

import { Tooltip, Badge, Tag } from "antd";
import Card from "antd/lib/card/Card";

import { useAppSelector } from "../redux/hooks";

import { TaskType } from "../types";
import { TASK_PRIORITY_COLOR_MAP } from "../constants";

type TaskPropsType = {
  task: TaskType;
  index: number;
};

const TaskCard: React.FC<TaskPropsType> = ({ task, index }: TaskPropsType) => {
  const boardId = useAppSelector((state) => state.tasks.board?.identifier);

  const cardTitle = () => {
    return (
      <Tooltip title="Otwórz zadanie" placement="bottom">
        <Link to={`/tasks/${task.identifier}`} state={{ boardId: boardId }}>
          {task.title}
        </Link>
      </Tooltip>
    );
  };
  return (
    <Draggable draggableId={task.identifier || ""} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Badge.Ribbon
            text={task.taskPriority}
            color={TASK_PRIORITY_COLOR_MAP[task.taskPriority as keyof typeof TASK_PRIORITY_COLOR_MAP]}
          >
            <Card
              title={cardTitle()}
              size="small"
              className="task-card"
              actions={[
                task.assignedUser ? (
                  <Tag
                    key="assigned-user-tag"
                    color="#40a9ff"
                  >{`${task.assignedUser.firstname} ${task.assignedUser.surname}`}</Tag>
                ) : null,
                task.loggedTime ? (
                  <Tag key="estimation-tag" color="#40a9ff">
                    {task.loggedTime}
                  </Tag>
                ) : null,
              ]}
            >
              {task.description}
            </Card>
          </Badge.Ribbon>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
