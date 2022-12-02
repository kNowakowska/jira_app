import "../css/SignUpPage.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, Button, Form, Input } from "antd";

import { createUser } from "../api/users";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const signUp = () => {
    const userData = { email, password, firstname: name, surname: lastName };
    createUser(userData, goHome);
  };

  const cancelLogin = () => {
    goHome();
  };

  return (
    <Layout>
      <Layout.Content className="register-content">
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={signUp}
          onFinishFailed={() => null}
          autoComplete="off"
          className="register-form"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email jest wymagany!" },
              {
                type: "email",
                message: "Wprowadzony email nie jest prawidłowy!",
              },
            ]}
          >
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>

          <Form.Item label="Imię" name="name" rules={[{ required: true, message: "Imię jest wymagane!" }]}>
            <Input className="login-input" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>

          <Form.Item label="Nazwisko" name="lastName" rules={[{ required: true, message: "Nazwisko jest wymagane!" }]}>
            <Input className="login-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Form.Item>

          <Form.Item label="Hasło" name="password" rules={[{ required: true, message: "Hasło jest wymagane!" }]}>
            <Input.Password className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Powtórz hasło"
            name="repeatPassword"
            rules={[
              { required: true, message: "Musisz powtórzyć hasło!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Wprowadzone hasła różnią się!"));
                },
              }),
            ]}
            dependencies={["password"]}
          >
            <Input.Password
              className="login-input"
              value={repeatedPassword}
              onChange={(e) => setRepeatedPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }} style={{ marginTop: "50px" }}>
            <Button htmlType="button" onClick={cancelLogin} size="large" className="btn-margin cancel-btn">
              Anuluj
            </Button>
            <Button type="primary" htmlType="submit" size="large" className="btn-margin">
              Załóż konto
            </Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </Layout>
  );
};

export default SignUpPage;
