import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import TaskDashboard from "./components/TaskDashboard";
import logo from '../../assets/logo.png';

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
        <img 
        src={logo} alt="logo" className='logo' style={{ height: '100px', width: 'auto'}}/>
        <h1 className="logo">Welcome to FocusFlow</h1>
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


