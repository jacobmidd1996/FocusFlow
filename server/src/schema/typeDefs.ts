const typeDefs = `
  type User {
    _id: String
    username: String
    password: String
    createdAt: String
  }

  type Tasks {
    _id: String
    title: String
    description: String
    status: String
    userId: String
    categoryId: String
    dueDate: String
    createdAt: String
    updatedAt: String
  }

  type Categories {
    _id: String
    name: String
  }

  type Auth {
    token: ID!
    user: User!
  }

  type Query {
    me: User
  }

  input TaskInput {
    title: String
    description: String
    dueDate: String
    status: String
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth
    addTask(title: String!, description: String, dueDate: String): Tasks
    updateTask(taskId: String!, title: String, description: String, dueDate: String): Tasks
    removeTask(taskId: String!): Boolean
  }
`;

export default typeDefs;

