import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

// GraphQL Mutation for Signup
const SIGNUP_MUTATION = gql`
  mutation AddUser($username: String!, $password: String!) {
    addUser(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

const SignupForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [addUser, { loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await addUser({
        variables: { username, password },
      });

      console.log("Signup successful:", data);

      // Save the token in localStorage
      localStorage.setItem("token", data.addUser.token);

      // Optional: Redirect the user or display a success message
      alert("Signup successful! You are now logged in.");
      window.location.reload(); // Refresh to re-render the App
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            Signup failed. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default SignupForm;

