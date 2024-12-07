const typeDefs = `
  type User {
   _id: String
  username: String
  email: String
  password: String
  }

  type Auth {
  token: ID!
  user: User!
  }

  type Query {
    me: User
  }


  type Mutation {
    login(email: String!, password:String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
  }
`;

export default typeDefs;
