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

  # Define the Category type
  type Category {
    _id: String
    name: String
  }

  # Define the Auth type for authentication
  type Auth {
    token: ID!
    user: User!
  }

  # Queries
  type Query {
    me: User
  }

  # Input type for creating or updating a task
  input TaskInput {
    title: String
    description: String
    dueDate: String
    status: String
  }

  # Mutations
  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth
    savedTask(task: TaskInput!): User # Mutation to save a new task
    addTask(title: String!, description: String, dueDate: String): Task
    updateTask(taskId: String!, title: String, description: String, dueDate: String): Task
    removeTask(taskId: String!): Boolean
  }
`;

export default typeDefs;



