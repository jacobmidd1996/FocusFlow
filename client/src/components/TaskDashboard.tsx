import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../utils/mutations";

const TaskDashboard: React.FC = () => {
  // State to manage new task inputs
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("Pending");

  // Apollo Client mutation hook
  const [addTask, { loading, error }] = useMutation(ADD_TASK);

  // Handle form submission to add a new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('addTask ===', taskTitle, taskDescription, taskDueDate, taskStatus)
      const { data } = await addTask({
        variables: {
          title: taskTitle,
          description: taskDescription,
          dueDate: taskDueDate,
          status: taskStatus,
        },
      });
      console.log("Task added:", data);

      // Clear the form inputs after successful task addition
      setTaskTitle("");
      setTaskDescription("");
      setTaskDueDate("");
      setTaskStatus("Pending");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Task Dashboard</h1>

      {/* Form to add new tasks */}
      <form onSubmit={handleAddTask} style={{ marginBottom: "20px" }}>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
              style={{ marginLeft: "10px", padding: "5px" }}
            />
          </label>
        </div>

        <div>
          <label>
            Description:
            <input
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
              style={{ marginLeft: "10px", padding: "5px" }}
            />
          </label>
        </div>

        <div>
          <label>
            Due Date:
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              style={{ marginLeft: "10px", padding: "5px" }}
            />
          </label>
        </div>

        <div>
          <label>
            Status:
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>

        <button type="submit" style={{ marginTop: "10px", padding: "10px 20px" }}>
          {loading ? "Adding Task..." : "Add Task"}
        </button>
      </form>

      {/* Display loading or error messages */}
      {loading && <p>Adding task...</p>}
      {error && <p>Error adding task: {error.message}</p>}
    </div>
  );
};

export default TaskDashboard;


