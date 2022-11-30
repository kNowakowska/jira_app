export type BoardType = {
  identifier?: string;
  shortcut?: string;
  name: string;
  owner?: UserType;
  contributors?: UserType[] | [];
  tasks?: TaskType[] | [];
};

export type UserType = {
  identifier: string;
  firstname: string;
  surname: string;
  email: string;
};

export type TaskPriorityType = "HIGHEST" | "MEDIUM" | "LOWER";

export type ColumnType = "TO_DO" | "IN_PROGRESS" | "READY_FOR_TESTING" | "TESTING" | "DONE";

export type DroppableColumnType = { [key: string]: ColumnDefinitionType };

export type ColumnDefinitionType = {
  id: string;
  title: string;
  taskIds: string[];
};

export type TaskType = {
  identifier?: string;
  title: string;
  taskNumber: string;
  description?: string;
  creationDate?: string;
  boardColumn?: ColumnType;
  taskPriority: TaskPriorityType;
  loggedTime?: 0;
  assignedUser?: UserType;
  reporter?: UserType;
  board?: string;
  assignedUserIdentifier?: string;
  orderInColumn?: number;
  comments?: CommentType[];
};

export type CommentType = {
  identifier?: string;
  content: string;
  createdDate?: string;
  creator?: UserType;
};
