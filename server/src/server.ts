import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import path, { dirname } from "path";
// import { authenticateToken } from "./utils/auth.js";
import { typeDefs, resolvers } from "./schema/index.js";
import db from "./config/connection.js";
import { fileURLToPath } from "url";
import { authenticateToken } from "./utils/auth.js";

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const directoryname = dirname(fileURLToPath(import.meta.url));

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(directoryname, "../../client/dist")));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(directoryname, "../../client/dist/index.html"));
    });
  }

  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}, Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
