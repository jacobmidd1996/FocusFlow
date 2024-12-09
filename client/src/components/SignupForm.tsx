
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import type { User } from "../models/user.ts";
// golly ge i hope this push works

const SignupForm = ({}: { handleModalClose: () => void }) => {
  const [userFormData, setUserFormData] = useState<User>({
    username: "",
    password: "",
    savedTasks: [],
  });

  const [validated] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const [addUser] = useMutation(ADD_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
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
      const { data } = await addUser({ variables: { username, password } });
      localStorage.setItem("token", data.addUser.token);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <p style={{ color: "red" }}>Signup failed.</p>}
      </form>
    </div>
  );
};

export default SignupForm;




