export const user = {
  id: 1,
  name: "Jane",
  last_name: "Smith",
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

export const initialDNDData = {
  tasks: {
    "task-1": { id: "task-1", title: "Task 1 Title" },
    "task-2": { id: "task-2", title: "Task 2 Title" },
    "task-3": { id: "task-3", title: "Task 3 Title" },
    "task-4": { id: "task-4", title: "Task 4 Title" },
    "task-5": { id: "task-5", title: "Task 5 Title" },
  },
  columns: {
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
  },
  columnOrder: ["column-1", "column-2", "column-3", "column-4", "column-5"],
};
