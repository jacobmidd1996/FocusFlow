import { User } from "../models/index.js";
import { signToken, AuthenticationError } from "../services/auth.js";
import { LoginUserArgs, AddUserArgs, TaskDataArgs } from "../interfaces/Login.js";
// import { v4 as uuidv4 } from "uuid";

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      console.log("Context user:", context.user);
      const foundUser = await User.findOne({ _id: context.user._id });
      if (!foundUser) {
        throw new AuthenticationError("User not found");
      }
      return foundUser;
    },
  },
  Mutation: {
    login: async (_parent: any, { username, password }: LoginUserArgs) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new AuthenticationError("Could not authenticate user.");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Could not authenticate user.");
      }
      const token = signToken(user.username, user._id);
      return { token, user };
    },
    addUser: async (_parent: any, args: AddUserArgs) => {
      console.log("Add User Args:", args);
      const user = await User.create({ ...args });
      const token = signToken(user.username, user._id);
      return { token, user };
    },
    removeTask: async (_parent: any, { taskId }: { taskId: string }, context: any) => {
      console.log(taskId)
      console.log(context.user)
      console.log("context")
      const foundUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { savedTask: { _id: taskId } } },
        { new: true }
      );
      console.log("===")
      console.log(foundUser)
      return foundUser;
    },
    savedTask: async (_parent: any, { task }: { task: TaskDataArgs }, context: any) => {
      console.log("savedTask ===", task, context.user);
      if (!context.user) {
        throw new AuthenticationError("Not authenticated");
      }

      const newTask = {
        ...task,
      };

      const updatedUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { savedTask: newTask } },
        { new: true }
      );

      if (!updatedUser) {
        console.error("Failed to update user:", updatedUser);
        throw new Error("User not found or failed to save task");
      }

      console.log("New Task Saved:", newTask);
      return updatedUser;
    },

    updateTask: async (
      _parent: any,
      { taskId, updates }: { taskId: string; updates: Partial<TaskDataArgs> },
      context: any
    ) => {
      const updatedTask = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const foundUser = await User.findOneAndUpdate(
        { _id: context.user._id, "savedTask._id": taskId },
        { $set: { "savedTask.$": updatedTask } },
        { new: true }
      );

      if (!foundUser) {
        throw new Error("Task not found or user not authenticated.");
      }

      return foundUser;
    },
  },
};

export default resolvers;
