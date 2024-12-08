import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3001/graphql", // Replace with your GraphQL server URL
  cache: new InMemoryCache(), // Handles caching for queries/mutations
});

export default client;

