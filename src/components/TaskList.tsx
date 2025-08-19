import type { TaskListProps } from "../types";
import { FcLowPriority } from "react-icons/fc";
import { FcMediumPriority } from "react-icons/fc";
import { FcHighPriority } from "react-icons/fc";

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  handleComplete,
  handleDelete,
  handleEdit,
}) => {
  return (
    <ul>
      {tasks.map((task, index) => (
        <li key={index}>
          <div className="task">
            <div className="text-wrapper">
              <h3 className={task.isCompleted ? "completed" : undefined}>
                {task.title}
              </h3>
              <p className={task.isCompleted ? "completed" : undefined}>
                {task.description}
              </p>
              <div className="priority">
                {task.priority === "low" && <FcLowPriority />}
                {task.priority === "medium" && <FcMediumPriority />}
                {task.priority === "high" && <FcHighPriority />}
              </div>
            </div>

            <button onClick={() => handleComplete(task.taskId)}>
              {`Mark as ${task.isCompleted ? "to do" : "completed"}`}
            </button>
            {!task.isCompleted && (
              <button onClick={() => handleEdit(task)}>Edit</button>
            )}
            <button onClick={() => handleDelete(task.taskId)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
