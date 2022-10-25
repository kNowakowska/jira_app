import React from "react";
import { Link } from "react-router-dom";

import { Drawer, Menu } from "antd";
import type { DrawerProps } from "antd/es/drawer";
import type { MenuProps } from "antd/es/menu";
import { TableOutlined, UserOutlined, FormOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(label: React.ReactNode, key?: React.Key | null, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link to="/">Home</Link>, "1", <HomeOutlined />),
  getItem("Your boards", "2", <TableOutlined />, [getItem("Board 1", "6")]),
  getItem(<Link to="/create_board">Create new board</Link>, "3", <FormOutlined />),
  getItem(<Link to="/profile">My account</Link>, "4", <UserOutlined />),
  getItem("Log out", "5", <LogoutOutlined />),
];

const CustomDrawer: React.FC<DrawerProps> = ({ onClose, open }) => {
  return (
    <Drawer placement="left" width={300} onClose={onClose} open={open} closable={false}>
      <Menu style={{ width: 300 }} defaultSelectedKeys={["1"]} defaultOpenKeys={["2"]} items={items} mode="inline" />
    </Drawer>
  );
};

export default CustomDrawer;
