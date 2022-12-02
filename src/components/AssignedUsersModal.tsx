import { Modal } from "antd";
import { UserType } from "../types";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Row, Col, Input, Select } from "antd";
import { useAppSelector } from "../redux/hooks";
import { addContributor, deleteContributor } from "../api/boards";
import { useEffect, useState } from "react";

type AssignedUsersModalPropsType = {
  open: boolean;
  onOk: () => void;
  onClose: () => void;
  boardId?: string;
  contributors: UserType[];
  isOwner: boolean;
  onChange: () => void;
};

const AssignedUsersModal = ({
  open,
  onOk,
  onClose,
  boardId,
  isOwner = false,
  contributors = [],
  onChange,
}: AssignedUsersModalPropsType) => {
  const users = useAppSelector((state) => state.users.users);

  const [selectedUser, setSelectedUser] = useState("");
  useEffect(() => {
    setSelectedUser("");
  }, [open]);

  const addUser = () => {
    if (boardId)
      addContributor(boardId, selectedUser, () => {
        onChange();
        setSelectedUser("");
      });
  };

  const deleteUser = (userId: string) => {
    if (boardId)
      deleteContributor(boardId, userId, () => {
        onChange();
      });
  };

  return (
    <Modal title="Przypisani użytkownicy" open={open} onOk={onOk} onCancel={onClose}>
      {isOwner && (
        <Row style={{ marginBottom: "10px" }}>
          <Col span={18}>
            <Select
              showSearch
              placeholder="Wybierz osobę"
              optionFilterProp="children"
              className="select"
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={users
                .filter(
                  (user) =>
                    !contributors.map((item) => item.identifier).includes(user.identifier) &&
                    localStorage.getItem("userId") !== user.identifier
                )
                .map((user) => ({ value: user.identifier, label: `${user.firstname} ${user.surname}` }))}
              style={{ width: "100%" }}
              value={selectedUser}
              onChange={setSelectedUser}
            />
          </Col>
          <Col span={4} offset={2}>
            <Button shape="circle" type="primary" icon={<SaveOutlined />} onClick={addUser} />
          </Col>
        </Row>
      )}
      {contributors.map((user) => (
        <Row key={user.identifier} style={{ marginBottom: "10px" }}>
          {isOwner ? (
            <>
              <Col span={18}>
                <Input value={`${user.firstname} ${user.surname}`} disabled />
              </Col>
              <Col span={4} offset={2}>
                <Button shape="circle" type="primary" icon={<DeleteOutlined />} onClick={() => deleteUser(user.identifier)} />
              </Col>
            </>
          ) : (
            <Col span={24}>
              <Input value={`${user.firstname} ${user.surname}`} disabled />
            </Col>
          )}
        </Row>
      ))}
    </Modal>
  );
};

export default AssignedUsersModal;
