const typeDefs = `
  type User {
   _id: String
  username: String
  email: String
  password: String
  savedBooks: [Book]
  bookCount: Int
  }

  type Book {
  _id: ID
  title: String
  authors: [String]
  bookId: String
  description: String
  forSale: String
  image: String
  link: String
  }
  type Auth {
  token: ID!
  user: User!
  }

  type Query {
    me: User
  }


  input SavedBookInput {
    title: String
    authors: [String]
    bookId: String
    description: String
    forSale: String
    image: String
    link: String
  }

  type Mutation {
    login(email: String!, password:String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: SavedBookInput ): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;
