import React from "react";
import { useQuery, gql } from "@apollo/client";
import LoginForm from "./components/LoginForm";

// GraphQL Query to fetch the authenticated user's data
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

const App: React.FC = () => {
  // Check if the user is authenticated by verifying the token in localStorage
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    // Clear the token and refresh the page
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (!token) {
    return (
      <div>
        <h1>Welcome to FocusFlow</h1>
        <LoginForm />
      </div>
    );
  }

  // Fetch user data using the token
  const { loading, error, data } = useQuery(ME_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  if (loading) return <p>Loading...</p>;

  if (error)
    return (
      <div>
        <p>Error: {error.message}</p>
        <pre>{JSON.stringify(error.networkError || {}, null, 2)}</pre>
      </div>
    );

  const tasks = data?.me?.savedTask || [];

  return (
    <div>
      <h1>Welcome, {data.me.username}!</h1>
      <button
        onClick={handleLogout}
        style={{
          margin: "10px 0",
          padding: "10px 20px",
          backgroundColor: "#FF4D4F",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
      <h2>Your Tasks</h2>
      {tasks.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {tasks.map((task: any) => (
            <li
              key={task._id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <small>Due: {new Date(task.dueDate).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no saved tasks yet. Add some to get started!</p>
      )}
    </div>
  );
};

export default App;



