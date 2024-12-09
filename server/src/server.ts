import express, { Request, Response, NextFunction } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { typeDefs, resolvers } from "./schema/index.js";
import { authenticateToken } from "./services/auth.js";

dotenv.config(); // Load environment variables

const app = express();

// Enable CORS for cross-origin requests
app.use(
  cors({
    origin: "http://localhost:3000", // Allow your front-end app to access the API
  })
);

// Middleware for token authentication
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret"
    );
    (req as any).user = decoded; // Attach decoded user data to the request
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
  return;
};

app.use(authMiddleware); // Apply the authentication middleware

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/focusflow";

mongoose
  .connect(MONGODB_URI, {
    dbName: "focusflow", // Optional: Specify the database name
    useUnifiedTopology: true, // Modern MongoDB drivers use this by default
  } as ConnectOptions) // Explicitly cast the options to ConnectOptions
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the server if MongoDB fails to connect
  });

// Apollo Server Setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(3001, () => {
    console.log("API server running on port 3001!");
    console.log("Use GraphQL at http://localhost:3001/graphql");
  });
})();
