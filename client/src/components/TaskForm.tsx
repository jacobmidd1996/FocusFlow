import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";

// GraphQL Mutation to save a new task
const SAVE_TASK_MUTATION = gql`
  mutation SaveTask($task: TaskInput!) {
    savedTask(task: $task) {
      _id
      title
      description
      dueDate
    }
  }
`;

// GraphQL Mutation to update an existing task
const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($taskId: String!, $updates: TaskInput!) {
    updateTask(taskId: $taskId, updates: $updates) {
      _id
      title
      description
      dueDate
    }
  }
`;

interface TaskFormProps {
  task?: {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
  };
  onComplete: () => void; // Callback when the form is submitted
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onComplete }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [saveTask] = useMutation(SAVE_TASK_MUTATION);
  const [updateTask] = useMutation(UPDATE_TASK_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (task) {
        // Update an existing task
        await updateTask({
          variables: {
            taskId: task._id,
            updates: { title, description, dueDate },
          },
        });
      } else {
        // Save a new task
        await saveTask({
          variables: {
            task: { title, description, dueDate },
          },
        });
      }

      alert("Task saved successfully!");
      onComplete();
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Failed to save task. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      <h2>{task ? "Edit Task" : "New Task"}</h2>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: "block", width: "100%", padding: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: "block", width: "100%", padding: "8px" }}
        ></textarea>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          style={{ display: "block", width: "100%", padding: "8px" }}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {task ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
};

export default TaskForm;
