interface ITask {
  title: string;
  description: string | undefined;
  isCompleted: boolean;
  taskId: string; // Using string to accommodate UUIDs
  priority: "low" | "medium" | "high";
  dueDate: Date;
}

interface TaskListProps {
  tasks: ITask[];
  handleComplete: (id: string) => void;
  handleDelete: (id: string) => void;
  handleEdit: (id: ITask) => void;
}

export type { ITask, TaskListProps };
