import "../css/LoginPage.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, Button, Form, Input } from "antd";

import { logIn } from "../api/system";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const loginFailed = (errorMsg: string) => {
    setErrorMsg(errorMsg);
  };

  const signIn = () => {
    const loginData = {
      email: email,
      password: password,
    };
    logIn(loginData, goHome, loginFailed);
  };

  const cancelLogin = () => {
    goHome();
  };

  const onFieldsChange = () => {
    setErrorMsg("");
  };

  return (
    <Layout>
      <Layout.Content className="login-content">
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={signIn}
          onFinishFailed={() => null}
          autoComplete="off"
          className="login-form"
          onFieldsChange={onFieldsChange}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
            validateStatus={errorMsg ? "error" : ""}
          >
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            validateStatus={errorMsg ? "error" : ""}
            help={errorMsg || ""}
          >
            <Input.Password className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }} style={{ marginTop: "50px" }}>
            <Button htmlType="button" onClick={cancelLogin} size="large" className="btn-margin cancel-btn">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large" className="btn-margin">
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </Layout>
  );
};

export default LoginPage;
