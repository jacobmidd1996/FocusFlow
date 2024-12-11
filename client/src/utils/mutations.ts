import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation SavedTask($task: TaskInput!) {
    savedTask(task: $task) {
      _id
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($username: String!, $password: String!) {
    addUser(username: $username, password: $password) {
      token
      user {
        username
        _id
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation Mutation($taskId: String!) {
    removeTask(taskId: $taskId) {
      savedTask {
        description
        title
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($taskId: String!, $updates: TaskInput!) {
    updateTask(taskId: $taskId, updates: $updates) {
      savedTask {
        _id
        description
      }
    }
  }
`;
