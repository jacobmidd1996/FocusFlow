import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_TASK, UPDATE_TASK, DELETE_TASK } from "../utils/mutations";
import { GET_TASKS } from "../utils/queries";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
};

type GetTasksQueryData = {
  tasks: Task[];
};

const TaskDashboard: React.FC = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("In Progress");
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const { loading: tasksLoading, error: tasksError, data: tasksData } = useQuery(GET_TASKS);

  const [addTask, { loading: addingTask }] = useMutation(ADD_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData?.me.savedTask);
    }
  }, [tasksData]);

  /**
   * Handle form submission to add or edit a task
   * - Adds a new task or updates an existing task.
   */
  const handleAddOrEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editTaskId) {
        // Update existing task
        await updateTask({
          variables: {
            taskId: editTaskId,
            updates: {
              title: taskTitle,
              description: taskDescription,
              dueDate: taskDueDate,
              status: taskStatus,
            },
          },
        });
        setEditTaskId(null);
      } else {
        // Add new task
        await addTask({
          variables: {
            task: {
              title: taskTitle,
              description: taskDescription,
              dueDate: taskDueDate,
              status: taskStatus,
            },
          },
        });
      }

      // Clear the form inputs
      setTaskTitle("");
      setTaskDescription("");
      setTaskDueDate("");
      setTaskStatus("Pending");
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  /**
   * Handle editing a task
   * - Populates the form with the task's details for editing.
   */
  const handleEditTask = (task: any) => {
    console.log("🚀 ~ handleEditTask ~ task:", task);
    setEditTaskId(task._id);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDueDate(task.dueDate);
    setTaskStatus(task.status);
  };

  /**
   * Handle deleting a task
   * - Removes the task from the list.
   */
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask({
        variables: { taskId: id },
        update(cache, { data: { removeTask } }) {
          const existingData = cache.readQuery<GetTasksQueryData>({ query: GET_TASKS });

          if (existingData?.tasks) {
            cache.writeQuery({
              query: GET_TASKS,
              data: {
                tasks: existingData.tasks.filter((task) => task.id !== removeTask.taskId),
              },
            });
          }
        },
      });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Task Dashboard</h1>

      {/* Form to add or edit tasks */}
      <form onSubmit={handleAddOrEditTask} style={{ marginBottom: "20px" }}>
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
              required
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
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>

        <button type="submit" style={{ marginTop: "10px", padding: "10px 20px" }}>
          {editTaskId ? "Update Task" : addingTask ? "Saving..." : "Add Task"}
        </button>
      </form>

      {tasksLoading && <p>Loading tasks...</p>}
      {tasksError && <p>Error loading tasks: {tasksError.message}</p>}
      <ul>
        {tasks.map((task: any) => (
          <li key={task._id} style={{ marginBottom: "10px" }}>
            <strong>{task.title}</strong> - {task.description} - Due: {task.dueDate} - Status: {task.status}
            <button onClick={() => handleEditTask(task)} style={{ marginLeft: "10px", padding: "5px" }}>
              Edit
            </button>
            <button onClick={() => handleDeleteTask(task._id)} style={{ marginLeft: "10px", padding: "5px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskDashboard;
