import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";

// Import schema from Task.js
import taskSchema from "./Task.js";
import type { TaskDocument } from "./Task.js";

export interface UserDocument extends Document {
  id: string;
  username: string;
  password?: string; // Marking as optional in case it's excluded in queries
  savedTask?: TaskDocument[]; // Marking as optional for flexibility
  isCorrectPassword(password: string): Promise<boolean>;
  taskCount: number;
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    savedTask: [taskSchema], // Array of Task subdocuments
  },
  {
    toJSON: {
      virtuals: true, // Enable virtuals for taskCount
    },
  }
);

// Hash user password before saving
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    if (this.password) {
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }
  next();
});

// Custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password: string) {
  try {
    return await bcrypt.compare(password, this.password!); // Use `!` to assert password is not null
  } catch (error) {
    console.error("Error validating password:", error);
    return false;
  }
};

// Virtual field to count the number of tasks
userSchema.virtual("taskCount").get(function () {
  return this.savedTask?.length || 0; // Default to 0 if savedTask is undefined
});

// Create and export the User model
const User = model<UserDocument>("User", userSchema);

export default User;

