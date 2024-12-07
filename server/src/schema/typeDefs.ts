const typeDefs = `
  type User {
   _id: String
  username: String
  password: String
  createdAt: String
  }

  type Tasks {
  "_id": String
  "title": String
  "description": String
  "status": String
  "userId": String
  "categoryId": String
  "dueDate": String
  }

  type Categories {
  "_id": "unique_category_id",
  "name": "Work"
  }

  type Auth {
  token: ID!
  user: User!
  }

  type Query {
    me: User
  }

  input SaveTaskInput {
    title: String
    bookId: String
    description: String
  }

  type Mutation {
    login(email: String!, password:String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    removeTask(TaskId: String!): User
  }
`;

export default typeDefs;
