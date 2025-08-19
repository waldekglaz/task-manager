import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface FormProps {
  handleReset: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  taskTitle: string;
  setTaskTitle: (value: string) => void;
  taskDescription: string;
  setTaskDescription: (value: string) => void;
  isEditing: boolean;
  setPriority: (value: "low" | "medium" | "high") => void;
  priority: "low" | "medium" | "high";
  handleCancel: () => void;
  dueDate: any;
  setDueDate: (value: any) => void;
}

const Form = ({
  handleSubmit,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  handleReset,
  isEditing,
  setPriority,
  priority,
  handleCancel,
  dueDate,
  setDueDate,
}: FormProps) => {
  return (
    <form action="" onSubmit={(e) => handleSubmit(e)}>
      <input
        type="text"
        placeholder="Task title"
        required
        className="task-title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <textarea
        placeholder="Task description"
        className="task-description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        rows={5}
        cols={30}
      ></textarea>
      <select
        onChange={(e) =>
          setPriority(e.target.value as "low" | "medium" | "high")
        }
        value={priority}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <DatePicker
        selected={dueDate}
        onChange={(date) => setDueDate(date)}
        showTimeSelect
        dateFormat="Pp"
      />

      <button type="submit">{isEditing ? "Save Changes" : "Add Task"}</button>
      <button type="reset" onClick={() => handleReset()}>
        Reset
      </button>
      <button type="button" onClick={() => handleCancel()}>
        Cancel
      </button>
    </form>
  );
};

export default Form;
