export type TaskPriorityType = "HIGHEST" | "MEDIUM" | "LOWER";

export type ColumnType = "TO_DO" | "IN_PROGRESS" | "READY_FOR_TESTING" | "TESTING" | "DONE";

export type LoginRequestType = {
  email: string;
  password: string;
};

export type LoginResponseType = {
  accessToken: string;
  userIdentifier: string;
};

export type LogoutResponseType = {
  userIdentifier?: string;
};

export type BoardType = {
  identifier: string;
  shortcut: string;
  name: string;
  owner: UserType;
  contributors: UserType[];
  tasks: TaskType[];
  createdDate?: string;
};

export type UserType = {
  identifier: string;
  firstname: string;
  surname: string;
  email: string;
  registered?: string;
};

export type DroppableColumnType = { [key: string]: ColumnDefinitionType };

export type ColumnDefinitionType = {
  id: string;
  title: string;
  taskIds: string[];
};

export type ChangeTaskStatusRequestType = {
  newTaskColumn?: string;
  positionInColumn: number;
};

export type TaskType = {
  identifier: string;
  title: string;
  taskNumber: string;
  description?: string;
  creationDate: string;
  boardColumn: ColumnType;
  taskPriority: TaskPriorityType;
  loggedTime?: number;
  assignedUser?: UserType;
  reporter: UserType;
  assignedUserIdentifier?: string;
  orderInColumn: number;
  comments: CommentType[];
  isArchived: boolean;
  isDeleted: boolean;
};

export type CommentType = {
  identifier: string;
  content: string;
  createdDate: string;
  creator: UserType;
};

export enum ReportType {
  None = "Brak",
  Board = "Tabele",
  User = "Użytkownicy"
}

export enum UserReportType {
  withArchived = "withArchived",
  withoutArchived = "withoutArchived"
}

export const USER_REPORT_TYPE_MAP = {
  [UserReportType.withArchived]: "Z zadaniami archiwalnymi",
  [UserReportType.withoutArchived]: "Bez zadan archiwalnych"
}