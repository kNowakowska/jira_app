import "../css/AccountPage.css";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";

import { Layout, Button, Form, Input, Col, Row } from "antd";

import ConfirmModal from "../components/ConfirmModal";
import { logOut } from "../redux/systemSlice";

const AccountPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loggedUser = useAppSelector((state) => state.system.user);

  const [editMode, setEditMode] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [form] = Form.useForm<{ name: string; lastName: string; email: string; password: string; repeatPassword: string }>();
  const nameValue = Form.useWatch("name", form);

  useEffect(() => {
    console.log(nameValue);
  }, [nameValue]);

  const saveUser = () => {
    form.submit();
    setEditMode(false);
  };

  const cancelSave = () => {
    setEditMode(false);
    form.resetFields();
  };

  const openEditMode = () => {
    setEditMode(true);
  };

  const openDeleteConfirmModal = () => {
    setConfirmModalOpen(true);
  };

  const deleteUser = () => {
    dispatch(logOut());
    navigate("/");
  };

  const cancelDeleteUser = () => {
    setConfirmModalOpen(false);
  };

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
                label="Name"
                name="name"
                initialValue={loggedUser?.name}
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input className="login-input" disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last name"
                name="lastName"
                initialValue={loggedUser?.last_name}
                rules={[{ required: true, message: "Please input your last name!" }]}
              >
                <Input className="login-input" disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                initialValue={loggedUser?.email}
                rules={[{ required: true, message: "Please input your email!" }]}
              >
                <Input type="email" disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Password" name="password" initialValue={""}>
                <Input.Password className="login-input" disabled={!editMode} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Repeat Password"
                name="repeatPassword"
                initialValue={""}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value && getFieldValue("password")) return Promise.reject(new Error("Please repeat your password!"));
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("The two passwords that you entered do not match!"));
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
                  Cancel
                </Button>
              </Col>
              <Col span={12}>
                <Button type="primary" htmlType="submit" size="large" className="btn-margin" onClick={saveUser}>
                  Save
                </Button>
              </Col>
            </Row>
          ) : (
            <Row gutter={24}>
              <Col span={12}>
                <Button htmlType="button" onClick={openDeleteConfirmModal} size="large" className="btn-margin">
                  Delete
                </Button>
              </Col>
              <Col span={12}>
                <Button onClick={openEditMode} type="primary" size="large" className="btn-margin">
                  Edit
                </Button>
              </Col>
            </Row>
          )}
        </Form>
        <ConfirmModal
          open={confirmModalOpen}
          onOk={deleteUser}
          onCancel={cancelDeleteUser}
          title="Delete user"
          description="This action is permament. Are you sure you want to delete your account?"
        />
      </Layout.Content>
    </Layout>
  );
};

export default AccountPage;
