import { User } from "../models/index.js";
import { signToken, AuthenticationError } from "../services/auth.js";
import {
  LoginUserArgs,
  AddUserArgs,
  TaskDataArgs,
} from "../interfaces/Login.js";

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      const foundUser = await User.findOne({
        $or: [
          { _id: context.user ? context.user._id : context.params.id },
          { username: context.params.username },
        ],
      });
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
      const user = await User.create({ ...args });
      const token = signToken(user.username, user._id);
      return { token, user };
    },
    removeTask: async (
      _parent: any,
      { taskId }: { taskId: string },
      context: any
    ) => {
      const foundUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { savedTask: { _id: taskId } } },
        { new: true }
      );
      return foundUser;
    },
    savedTask: async (
      _parent: any,
      { task }: { task: TaskDataArgs },
      context: any
    ) => {
      const newTask = {
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: task.dueDate || null,
      };

      const foundUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { savedTask: newTask } },
        { new: true }
      );
      return foundUser;
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


