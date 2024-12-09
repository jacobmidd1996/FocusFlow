import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";

// GraphQL Query to fetch tasks
const ME_QUERY = gql`
  query GetMe {
    me {
      _id
      username
      savedTask {
        _id
        title
        description
        dueDate
      }
    }
  }
`;

// GraphQL Mutation to delete a task
const DELETE_TASK_MUTATION = gql`
  mutation RemoveTask($taskId: String!) {
    removeTask(taskId: $taskId) {
      _id
      username
      savedTask {
        _id
      }
    }
  }
`;

const TaskDashboard: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(ME_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const [deleteTask] = useMutation(DELETE_TASK_MUTATION, {
    onCompleted: () => {
      refetch(); // Refresh the task list after deletion
    },
  });

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask({ variables: { taskId } });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const tasks = data?.me?.savedTask || [];

  return (
    <div className="container">
      <h2>Your Tasks</h2>
      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task: any) => (
            <li key={task._id} className="task-item">
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <small>Due: {new Date(task.dueDate).toLocaleDateString()}</small>
              <button onClick={() => handleDelete(task._id)} className="button delete-button">
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found. Add some to get started!</p>
      )}
    </div>
  );
};

export default TaskDashboard;

