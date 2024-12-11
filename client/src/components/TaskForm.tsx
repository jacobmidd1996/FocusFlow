import React, { useState } from "react";
import { useMutation,} from "@apollo/client";
// import {GET_TASKS } from "../utils/queries.js"
import { ADD_TASK, UPDATE_TASK } from "../utils/mutations.js";

interface TaskFormProps {
  task?: {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
  };
  onComplete: (task: { title: string; description: string; dueDate: string }) => void;
}


const TaskForm: React.FC<TaskFormProps> = ({ task, onComplete}) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveTask] = useMutation(ADD_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    let user;
    
    try {
      if (task) {
        user = await updateTask({
          variables: {
            taskId: task._id,
            updates: { title, description, dueDate },
          },
        });
      } else {
        user = await saveTask({
          variables: {
            title: title,
            description: description,
            dueDate: dueDate,
            status: "not started"
          },
        });
      }

      alert("Task saved successfully!");
      setLoading(false);
      alert(JSON.stringify(task))
      alert(JSON.stringify(user))
      // onComplete(saveTask);
    } catch (err) {
      console.error("Error saving task:", err);
      setError("Failed to save task. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <h2>{task ? "Edit Task" : "New Task"}</h2>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default TaskForm;

