import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Drawer, Menu } from "antd";
import type { DrawerProps } from "antd/es/drawer";
import type { MenuProps } from "antd/es/menu";
import { TableOutlined, UserOutlined, FormOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logOut } from "../redux/systemSlice";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(label: React.ReactNode, key?: React.Key | null, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

type CustomDrawerType = {
  onClose?: () => void;
};

const CustomDrawer: React.FC<DrawerProps & CustomDrawerType> = ({ onClose, open }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loggedUser = useAppSelector((state) => state.system.user);

  const items: MenuItem[] = [
    getItem(<Link to="/">Home</Link>, "home", <HomeOutlined />),
    getItem(
      "Your boards",
      "boards",
      <TableOutlined />,
      loggedUser?.boards?.map((board) => getItem(<Link to={`/boards/${board.short}`}>{board.name}</Link>, board.short))
    ),
    getItem(<Link to="/new_board">Create new board</Link>, "create_board", <FormOutlined />),
    getItem(<Link to={`/profile/${loggedUser?.id}`}>My account</Link>, "profile", <UserOutlined />),
    getItem("Log out", "log_out", <LogoutOutlined />),
  ];

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "log_out") {
      dispatch(logOut());
      navigate("/");
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
