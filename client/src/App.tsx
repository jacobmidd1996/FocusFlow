import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

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
  const token = localStorage.getItem("token");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (!token) {
    return (
      <div>
        <h1>Welcome to FocusFlow</h1>
        {isSigningUp ? (
          <SignupForm />
        ) : (
          <LoginForm />
        )}
        <button
          onClick={() => setIsSigningUp(!isSigningUp)}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isSigningUp ? "Go to Login" : "Go to Signup"}
        </button>
      </div>
    );
  }

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
        <ul>
          {tasks.map((task: any) => (
            <li key={task._id}>
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




