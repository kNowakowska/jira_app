import Card from "antd/lib/card/Card";
import { TaskType } from "../types";
import { Draggable } from "react-beautiful-dnd";

import "./css/TaskCard.css";

type TaskPropsType = {
  task: TaskType;
  index: number;
};

const TaskCard: React.FC<TaskPropsType> = ({ task, index }: TaskPropsType) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title="Card"
          size="small"
          className="task-card"
        >
          Card content
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;
