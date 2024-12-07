import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";

// import schema from Book.js
import taskSchema from "./Book.js";
import type { taskDocument } from "./Book.js";

export interface UserDocument extends Document {
  id: string;
  username: string;
  password: string;
  savedTasks: TaskDocument[];
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
    savedTasks: [taskSchema],
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
userSchema.virtual("bookCount").get(function () {
  return this.savedTasks.length;
});

const User = model<UserDocument>("User", userSchema);

export default User;
