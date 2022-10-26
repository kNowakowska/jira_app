import "../css/BoardPage.css";

import { Layout } from "antd";
import { initialDNDData } from "../data";
import Column from "../components/Column";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Layout.Content className="board-content">
        {initialDNDData.columnOrder.map((columnId: string) => {
          const column = initialDNDData.columns[columnId as keyof typeof initialDNDData.columns];
          const tasks = column.taskIds.map(
            (taskId: string) => initialDNDData.tasks[taskId as keyof typeof initialDNDData.tasks]
          );

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </Layout.Content>
    </Layout>
  );
};

export default HomePage;
