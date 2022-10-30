import "../css/LoginPage.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, Button, Form, Input } from "antd";

import { useAppDispatch } from "../redux/hooks";
import { logIn } from "../redux/systemSlice";

import { user } from "../data";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const signIn = () => {
    dispatch(logIn(user));
    navigate("/");
  };

  const cancelLogin = () => {
    navigate("/");
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
        >
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
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
