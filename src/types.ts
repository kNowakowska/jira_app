export type BoardType = {
  id: number;
  short: string;
  name: string;
  owner: number;
  assigned_users: number[] | [];
};

export type UserType = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  boards: BoardType[] | [];
};

export type TaskType = {
  id: string;
  title: string;
  description?: string;
  reporter?: number;
  assignee?: number;
  status?: number;
};

export type ColumnType = {
  id: string;
  title: string;
  taskIds: string[];
};
