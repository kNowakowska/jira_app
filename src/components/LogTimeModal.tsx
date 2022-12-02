import { useEffect, useState } from "react";
import { Modal, Input } from "antd";

type LogTimeModalPropsType = {
  open: boolean;
  onOk: (value: number) => void;
  onCancel: () => void;
  loggedTime: number;
};

const LogTimeModal = ({ open, onOk, onCancel, loggedTime }: LogTimeModalPropsType) => {
  const [time, setTime] = useState(loggedTime);

  useEffect(() => {
    setTime(loggedTime);
  }, [loggedTime]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => setTime(parseInt(e.target.value));

  return (
    <Modal title="Zaloguj czas" open={open} onOk={() => onOk(time)} onCancel={onCancel}>
      <Input value={time} onChange={handleTimeChange} type="number" />
    </Modal>
  );
};

export default LogTimeModal;
