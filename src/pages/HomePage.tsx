import "../css/HomePage.css";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { BoardType } from "../types";

import { Layout, Button, Typography } from "antd";

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const contributed = useAppSelector((state) => state.boards.contributed);
  const owned = useAppSelector((state) => state.boards.owned);

  const openBoard = (boardId: string | undefined) => {
    if (boardId) navigate(`/boards/${boardId}`);
  };

  return (
    <Layout>
      <Layout.Content className="home-content">
        <Title level={4} className="home-title">
          Utworzone tablice
        </Title>
        <div className="home-boards-list-area">
          {(owned || []).length ? (
            owned?.map((board: BoardType) => (
              <Button key={board.identifier} onClick={() => openBoard(board.identifier)} className="home-board-btn">
                {board.name}
              </Button>
            ))
          ) : (
            <Text disabled>Brak utworzonych tablic</Text>
          )}
        </div>
      </Layout.Content>
      <Layout.Content className="home-content">
        <Title level={4} className="home-title">
          Współtworzone tablice
        </Title>
        <div className="home-boards-list-area">
          {(contributed || []).length ? (
            contributed?.map((board: BoardType) => (
              <Button key={board.identifier} onClick={() => openBoard(board.identifier)} className="home-board-btn">
                {board.name}
              </Button>
            ))
          ) : (
            <Text disabled>Brak współtworzonych tablic</Text>
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default HomePage;
