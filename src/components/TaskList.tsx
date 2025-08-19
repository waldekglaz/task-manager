import type { TaskListProps } from "../types";
import { FcLowPriority } from "react-icons/fc";
import { FcMediumPriority } from "react-icons/fc";
import { FcHighPriority } from "react-icons/fc";
import { dateFormat, dueDateClass } from "../utils";
import { TiTick, TiTimes } from "react-icons/ti";
import { AiTwotoneEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

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
              <div className="due">
                <p
                  className={`${dueDateClass(task.dueDate)} ${
                    task.isCompleted && "completed"
                  }`}
                >
                  Due: {dateFormat(task.dueDate)}
                </p>
              </div>
            </div>

            <button onClick={() => handleComplete(task.taskId)}>
              {task.isCompleted ? <TiTimes /> : <TiTick />}
            </button>
            {!task.isCompleted && (
              <button onClick={() => handleEdit(task)}>
                <AiTwotoneEdit />
              </button>
            )}
            <button onClick={() => handleDelete(task.taskId)}>
              <FaTrashAlt />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
