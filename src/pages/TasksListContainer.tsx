import { Tabs } from "antd";
import type { TabsProps } from "antd";
import TasksList from "./TasksList";
import "../css/TasksListContainer.css";

const TasksListContainer = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Active Tasks`,
      children: <TasksList />,
    },
    {
      key: "2",
      label: `Archived tasks`,
      children: <TasksList archived />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} className="tabs" />;
};

export default TasksListContainer;
