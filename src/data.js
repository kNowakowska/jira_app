export const user = {
  identifier: "1",
  firstname: "Jane",
  surname: "Smith",
  email: "jane@com.pl",
  password: "password",
  boards: [
    {
      id: 1,
      short: "D08",
      name: "Board table 1",
      owner: 1,
      assigned_users: [],
    },
  ],
};

export const board = {
  identifier: "1",
  shortcut: "D08",
  name: "Board table 1",
  owner: { identifier: "1", firstname: "Jane", surname: "Smith", email: "jane@com.pl" },
  assigned_users: [{ identifier: "1", firstname: "Jane", surname: "Smith", email: "jane@com.pl" }],
};

export const initialTasks = {
  "task-1": {
    id: "task-1",
    title: "Task 1 Title",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  "task-2": { id: "task-2", title: "Task 2 Title", description: "Lorem Ipsum is simply dummy text of the printing and" },
  "task-3": { id: "task-3", title: "Task 3 Title", assignee: "John Smith" },
  "task-4": { id: "task-4", title: "Task 4 Title" },
  "task-5": { id: "task-5", title: "Task 5 Title" },
};
export const initialColumns = {
  "column-1": {
    id: "column-1",
    title: "To do",
    taskIds: ["task-1", "task-2", "task-3", "task-4", "task-5"],
  },
  "column-2": {
    id: "column-2",
    title: "In progress",
    taskIds: [],
  },
  "column-3": {
    id: "column-3",
    title: "Ready for testing",
    taskIds: [],
  },
  "column-4": {
    id: "column-4",
    title: "Testing",
    taskIds: [],
  },
  "column-5": {
    id: "column-5",
    title: "Done",
    taskIds: [],
  },
};
export const columnOrder = ["column-1", "column-2", "column-3", "column-4", "column-5"];
