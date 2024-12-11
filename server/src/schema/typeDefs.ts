const typeDefs = `
  # Define the User type
  type User {
    _id: String
    username: String
    password: String
    createdAt: String
    savedTask: [Task] # Link User with an array of Task subdocuments
  }

  # Define the Task type
  type Task {
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

  # Define the Auth type for authentication
  type Auth {
    token: ID!
    user: User!
  }

  # Input type for creating or updating a task
  input TaskInput {
    _id: String # Optional, for updates or client-side management
    title: String!
    description: String
    dueDate: String
    status: String
  }

  # Queries
  type Query {
    me: User
  }

  # Mutations
  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth
    savedTask(task: TaskInput!): User # Mutation to save a new task
    updateTask(taskId: String!, updates: TaskInput!): User # Mutation to update a task
    removeTask(taskId: String!): User # Mutation to remove a task
  }
`;

export default typeDefs;





