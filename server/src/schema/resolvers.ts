import { User } from "../models/index.js";
import { signToken, AuthenticationError } from "../services/auth.js";
import {
  LoginUserArgs,
  AddUserArgs,
  TaskDataArgs,
} from "../interfaces/Login.js";
import { LoginUserArgs, AddUserArgs } from "../interfaces/Login.js";

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
      // Find a user with the username
      const user = await User.findOne({ username });

      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError("Could not authenticate user.");
      }

      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);

      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError("Could not authenticate user.");
      }

      // Sign a token with the user's information
      const token = signToken(user.username, user._id);

      // Return the token and the user
      return { token, user };
    },
    addUser: async (_parent: any, args: AddUserArgs) => {
      // Create a new user with the provided username and password
      const user = await User.create({ ...args });

      // Sign a token with the user's information
      const token = signToken(user.username, user._id);

      // Return the token and the user
      return { token, user };
    },
    removeTask: async (
      _parent: any,
      { taskId }: { taskId: string },
      context: any
    ) => {
      const foundUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { taskId } } },
        { new: true }
      );
      return foundUser;
    },
    savedTask: async (
      _parent: any,
      { task }: { task: TaskDataArgs },
      context: any
    ) => {
      console.log(context.user);
      const foundUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { savedTask: { ...task } } },
        { new: true }
      );
      return foundUser;
    },
  },
};

export default resolvers;
