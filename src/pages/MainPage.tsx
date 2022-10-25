import { useNavigate } from "react-router-dom";
import "../css/MainPage.css";
import { Layout, Typography, Button } from "antd";

const MainPage = () => {
  const navigate = useNavigate();

  const loginHandler = () => {
    navigate("/login");
  };
  
  const signUpHandler = () => {
    navigate("/sign_up");
  };

  return (
    <Layout>
      <Layout.Header className="main-page-header-toolbar">
        <Button onClick={loginHandler} type="primary" size="large" className="btn-margin">
          Zaloguj się
        </Button>
        <Button onClick={signUpHandler} type="primary" size="large" className="btn-margin">
          Zarejestruj się
        </Button>
      </Layout.Header>
      <Layout.Content className="main-page-logo">
        <Typography className="temporary-logo">JIRA</Typography>
        <div id="container">
          <div className="steam" id="steam1" />
          <div className="steam" id="steam2" />
          <div className="steam" id="steam3" />
          <div className="steam" id="steam4" />
          <div id="cup">
            <div id="cup-body">
              <div id="cup-shade"></div>
            </div>
            <div id="cup-handle"></div>
          </div>
          <div id="saucer"></div>
          <div id="shadow"></div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default MainPage;
