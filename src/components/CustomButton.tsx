import "../css/CustomButton.css";
import { Button } from "antd";

type CustomButtonProps = {
  disabled?: boolean;
  children: string;
  href?: string | undefined;
  onClick: React.MouseEventHandler;
};

const CustomButton = ({ disabled = false, children, href = undefined, onClick }: CustomButtonProps) => {
  return (
    <Button disabled={disabled} type="primary" size="large" href={href} onClick={onClick} className="btn-margin">
      {children}
    </Button>
  );
};

export default CustomButton;
