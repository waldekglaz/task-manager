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

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
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
      };
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    }

    setTaskTitle("");
    setTaskDescription("");
    setEditingTaskId(null);
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setTaskTitle("");
    setTaskDescription("");
  };

  const handleDelete = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
  };

  const startEditing = (task: ITask) => {
    setTaskTitle(task.title);
    setTaskDescription(task.description || "");
    setEditingTaskId(task.taskId);
    setPriority(task.priority);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setTaskTitle("");
    setTaskDescription("");
    setEditingTaskId(null);
    setIsModalOpen(false);
  };

  return (
    <main>
      <h1>Task manager</h1>
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
        />
      </Modal>

      {tasks.length === 0 ? (
        <h2>You have no tasks yet</h2>
      ) : (
        <TaskList
          tasks={tasks}
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
