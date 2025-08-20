import { useState, useEffect } from "react";
import "./App.css";
import TaskList from "./components/TaskList";
import Form from "./components/Form";
// import Modal from "./components/Modal";
import Modal from "react-modal";
import type { ITask } from "./types";
import { v4 as uuidv4 } from "uuid";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#yourAppElement");

function App() {
  const [tasks, setTasks] = useState<ITask[] | []>(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
      return [];
    }
  });
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [sortBy, setSortBy] = useState<
    | "dueAsc"
    | "dueDesc"
    | "titleAsc"
    | "titleDesc"
    | "priorityHL"
    | "priorityLH"
    | "statusTodo"
    | "statusDone"
  >("dueAsc");

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }, [tasks]);

  const handleComplete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskId === taskId
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskTitle) {
      alert("Task title is required");
      return;
    }

    if (editingTaskId) {
      // edit mode
      setTasks(
        tasks.map((task) =>
          task.taskId === editingTaskId
            ? {
                ...task,
                title: taskTitle,
                description: taskDescription || undefined,
                priority,
                dueDate,
              }
            : task
        )
      );
    } else {
      // Add task
      const newTask: ITask = {
        title: taskTitle,
        description: taskDescription || undefined,
        isCompleted: false,
        taskId: uuidv4(),
        priority,
        dueDate,
      };
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    }

    setTaskTitle("");
    setTaskDescription("");
    setEditingTaskId(null);
    setIsModalOpen(false);
    setDueDate(new Date());
  };

  const handleReset = () => {
    setTaskTitle("");
    setTaskDescription("");
    setDueDate(new Date());
    setPriority("medium");
  };

  const handleDelete = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
  };

  const startEditing = (task: ITask) => {
    setTaskTitle(task.title);
    setTaskDescription(task.description || "");
    setEditingTaskId(task.taskId);
    setPriority(task.priority);
    setDueDate(new Date(task.dueDate));
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setTaskTitle("");
    setTaskDescription("");
    setEditingTaskId(null);
    setIsModalOpen(false);
  };

  const priorityRank: Record<ITask["priority"], number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const filteredTasks = (tasks as ITask[]).filter((task) => {
    if (filter === "todo") return !task.isCompleted;
    if (filter === "done") return task.isCompleted;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueAsc") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === "dueDesc") {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    if (sortBy === "titleAsc") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "titleDesc") {
      return b.title.localeCompare(a.title);
    }
    if (sortBy === "priorityHL") {
      return priorityRank[b.priority] - priorityRank[a.priority];
    }
    if (sortBy === "priorityLH") {
      return priorityRank[a.priority] - priorityRank[b.priority];
    }
    if (sortBy === "statusTodo") {
      return Number(a.isCompleted) - Number(b.isCompleted);
    }
    if (sortBy === "statusDone") {
      return Number(b.isCompleted) - Number(a.isCompleted);
    }
    return 0;
  });

  return (
    <main>
      <h1>Task manager</h1>

      {tasks.length > 0 && (
        <div className="controls">
          <div className="filters">
            <button
              className={filter === "all" ? "active" : undefined}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "todo" ? "active" : undefined}
              onClick={() => setFilter("todo")}
            >
              To do
            </button>
            <button
              className={filter === "done" ? "active" : undefined}
              onClick={() => setFilter("done")}
            >
              Done
            </button>
          </div>
          <div className="sort">
            <label htmlFor="sortBy">Sort:</label>{" "}
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="dueAsc">Due date (oldest first)</option>
              <option value="dueDesc">Due date (newest first)</option>
              <option value="titleAsc">Title (A–Z)</option>
              <option value="titleDesc">Title (Z–A)</option>
              <option value="priorityHL">Priority (high → low)</option>
              <option value="priorityLH">Priority (low → high)</option>
              <option value="statusTodo">Status (to do first)</option>
              <option value="statusDone">Status (done first)</option>
            </select>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Form
          handleReset={handleReset}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          taskDescription={taskDescription}
          setTaskDescription={setTaskDescription}
          isEditing={!!editingTaskId}
          setPriority={setPriority}
          priority={priority}
          dueDate={dueDate}
          setDueDate={setDueDate}
        />
      </Modal>

      {tasks.length === 0 ? (
        <h2>You have no tasks yet</h2>
      ) : (
        <TaskList
          tasks={sortedTasks}
          handleComplete={handleComplete}
          handleDelete={handleDelete}
          handleEdit={startEditing}
        />
      )}
      {!isModalOpen && (
        <button onClick={() => setIsModalOpen(true)} className="open-form-btn">
          +
        </button>
      )}
    </main>
  );
}

export default App;
