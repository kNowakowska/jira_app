import { useState } from "react";

import "./css/Navbar.css";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

import CustomDrawer from "./Drawer";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="toolbar">
      <Button type="primary" icon={<MenuOutlined />} size="large" onClick={showDrawer} />
      <CustomDrawer open={open} onClose={onClose} />
    </div>
  );
};

export default Navbar;
