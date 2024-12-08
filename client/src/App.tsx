import React from "react";
import { useQuery, gql } from "@apollo/client";

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
  const { loading, error, data } = useQuery(ME_QUERY);

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


