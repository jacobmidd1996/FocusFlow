import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation AddTask($title: String!, $description: String!) {
    addTask(title: $title, description: $description) {
      id
      title
      description
      status
    }
  }
`;
export const LOGIN_USER = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        email
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        username
        email
      }
    }
  }
`;
