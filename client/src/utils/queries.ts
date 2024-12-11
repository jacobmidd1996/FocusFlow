import { gql } from "@apollo/client";

export const GET_TASKS = gql`
query ME {
  me {
    _id
    createdAt
    password
    savedTask {
      _id
      categoryId
      createdAt
      description
      dueDate
      status
      title
      updatedAt
      userId
    }
  }
}
`;

