import "../css/AccountPage.css";

import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";

import { Layout, Button, Form, Input, Col, Row } from "antd";

import ConfirmModal from "../components/ConfirmModal";
import { deleteUser, updateUser } from "../api/users";

const AccountPage: React.FC = () => {
  const navigate = useNavigate();

  const loggedUser = useAppSelector((state) => state.system.user);

  const [editMode, setEditMode] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [form] = Form.useForm<{ name: string; lastName: string; email: string; password: string; repeatPassword: string }>();
  const nameValue = Form.useWatch("name", form);
  const lastNameValue = Form.useWatch("lastName", form);
  const emailValue = Form.useWatch("email", form);
  const passwordValue = Form.useWatch("password", form);
  const repeatedPasswordValue = Form.useWatch("repeatPassword", form);

  useEffect(() => {
    form.resetFields();
  }, [loggedUser]);

  const saveUser = () => {
    const userData = {
      identifier: loggedUser?.identifier,
      firstname: nameValue,
      surname: lastNameValue,
      email: emailValue,
    };
    if (passwordValue) userData["password" as keyof typeof userData] = passwordValue;
    updateUser(userData, closeEditMode, cancelSave);
  };

  const closeEditMode = () => {
    setEditMode(false);
  };

  const cancelSave = () => {
    closeEditMode();
    form.resetFields();
  };

  const openEditMode = () => {
    setEditMode(true);
  };

  const openDeleteConfirmModal = () => {
    setConfirmModalOpen(true);
  };

  const goHome = () => {
    navigate("/");
  };

  const handleDeleteUser = () => {
    deleteUser(loggedUser?.identifier, goHome);
  };

  const cancelDeleteUser = () => {
    setConfirmModalOpen(false);
  };

  const isModified =
    nameValue !== loggedUser?.firstname ||
    lastNameValue !== loggedUser?.surname ||
    emailValue !== loggedUser?.email ||
    (passwordValue && passwordValue === repeatedPasswordValue);

  return (
    <Layout>
      <Layout.Content className="account-content">
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          autoComplete="off"
          className="edit-user-form"
          layout="inline"
          form={form}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Imię"
                name="name"
                initialValue={loggedUser?.firstname}
                rules={[{ required: true, message: "Imię jest wymagane!" }]}
              >
                <Input className="login-input" disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Nazwisko"
                name="lastName"
                initialValue={loggedUser?.surname}
                rules={[{ required: true, message: "Nazwisko jest wymagane!" }]}
              >
                <Input className="login-input" disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                initialValue={loggedUser?.email}
                rules={[
                  { required: true, message: "Email jest wymagany!" },
                  {
                    type: "email",
                    message: "Wprowadzony email nie jest poprawny!",
                  },
                ]}
              >
                <Input type="email" disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hasło" name="password" initialValue={""}>
                <Input.Password className="login-input" disabled={!editMode} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Powtórz hasło"
                name="repeatPassword"
                initialValue={""}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value && getFieldValue("password")) return Promise.reject(new Error("Proszę powtórz hasło"));
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Wprowadzone hasła się różnią!"));
                    },
                  }),
                ]}
                dependencies={["password"]}
              >
                <Input.Password className="login-input" disabled={!editMode} />
              </Form.Item>
            </Col>
          </Row>
          {editMode ? (
            <Row gutter={24}>
              <Col span={12}>
                <Button htmlType="button" onClick={cancelSave} size="large" className="btn-margin cancel-btn">
                  Anuluj
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="btn-margin"
                  onClick={saveUser}
                  disabled={!isModified}
                >
                  Zapisz
                </Button>
              </Col>
            </Row>
          ) : (
            <Row gutter={24}>
              <Col span={12}>
                <Button htmlType="button" onClick={openDeleteConfirmModal} size="large" className="btn-margin">
                  Usuń
                </Button>
              </Col>
              <Col span={12}>
                <Button onClick={openEditMode} type="primary" size="large" className="btn-margin">
                  Edytuj
                </Button>
              </Col>
            </Row>
          )}
        </Form>
        <ConfirmModal
          open={confirmModalOpen}
          onOk={handleDeleteUser}
          onCancel={cancelDeleteUser}
          title="Usuń użytkownika"
          description="Ta operacja jest nieodwracalna. Czy na pewno chcesz usunąć swoje hasło?"
        />
      </Layout.Content>
    </Layout>
  );
};

export default AccountPage;
