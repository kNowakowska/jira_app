import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Drawer, Menu } from "antd";
import type { DrawerProps } from "antd/es/drawer";
import type { MenuProps } from "antd/es/menu";
import { TableOutlined, UserOutlined, FormOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";

import { useAppSelector } from "../redux/hooks";
import { logOut } from "../api/system";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

type CustomDrawerType = {
  onClose?: () => void;
};

const CustomDrawer: React.FC<DrawerProps & CustomDrawerType> = ({ onClose, open }) => {
  const navigate = useNavigate();
  const loggedUser = useAppSelector((state) => state.system.user);
  const contributed = useAppSelector((state) => state.boards.contributed);
  const owned = useAppSelector((state) => state.boards.owned);

  const goHome = () => {
    navigate("/");
  };

  const items: MenuItem[] = [
    getItem(<Link to="/">Home</Link>, "home", <HomeOutlined />),
    getItem("Your boards", "boards", <TableOutlined />, [
      getItem(
        "Contributed",
        "g1",
        null,
        contributed?.map((board) => getItem(<Link to={`/boards/${board.identifier}`}>{board.name}</Link>, board.identifier)),
        "group"
      ),
      getItem(
        "Owned",
        "g2",
        null,
        owned?.map((board) => getItem(<Link to={`/boards/${board.identifier}`}>{board.name}</Link>, board.identifier)),
        "group"
      ),
    ]),
    getItem(<Link to="/new_board">Create new board</Link>, "create_board", <FormOutlined />),
    getItem(<Link to={`/profile/${loggedUser?.identifier}`}>My account</Link>, "profile", <UserOutlined />),
    getItem("Log out", "log_out", <LogoutOutlined />),
  ];

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "log_out" && loggedUser) {
      logOut(loggedUser.identifier, goHome);
    } else {
      onClose?.();
    }
  };

  return (
    <Drawer placement="left" width={300} onClose={onClose} open={open} closable={false}>
      <Menu
        style={{ width: 300 }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["2"]}
        items={items}
        mode="inline"
        onClick={onClick}
      />
    </Drawer>
  );
};

export default CustomDrawer;
