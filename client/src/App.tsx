import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import TaskDashboard from "./components/TaskDashboard";

const App: React.FC = () => {
  const token = localStorage.getItem("token");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (!token) {
    return (
      <div className="container">
        <h1>Welcome to FocusFlow</h1>
        {isSigningUp ? <SignupForm /> : <LoginForm />}
        <button onClick={() => setIsSigningUp(!isSigningUp)}>
          {isSigningUp ? "Go to Login" : "Go to Signup"}
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <TaskDashboard />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;


