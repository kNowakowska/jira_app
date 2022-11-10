export type BoardType = {
  identifier?: string;
  shortcut: string;
  name: string;
  owner?: UserType;
  contributors?: UserType[] | [];
};

export type UserType = {
  identifier: string;
  firstname: string;
  surname: string;
  email: string;
};

export type TaskType = {
  id: string;
  title: string;
  description?: string;
  reporter?: number;
  assignee?: number | string; // do zmiany na tylko number
  status?: number;
  board?: string; //number, because of id
};

export type ColumnType = {
  id: string;
  title: string;
  taskIds: string[];
};
