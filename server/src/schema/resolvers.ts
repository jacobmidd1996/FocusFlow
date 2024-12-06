import User from "../models/User.js";
import { signToken, AuthenticationError } from "../services/auth.js";
import {
  LoginUserArgs,
  AddUserArgs,
  BookDataArgs,
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
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });

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
      const token = signToken(user.username, user.email, user._id);

      // Return the token and the user
      return { token, user };
    },
    addUser: async (_parent: any, args: AddUserArgs) => {
      // Create a new user with the provided username, email, and password
      const user = await User.create({ ...args });

      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);

      // Return the token and the user
      return { token, user };
    },
    removeBook: async (
      _parent: any,
      { bookId }: { bookId: string },
      context: any
    ) => {
      const foundUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return foundUser;
    },
    saveBook: async (
      _parent: any,
      { book }: { book: BookDataArgs },
      context: any
    ) => {
      console.log(context.user);
      const foundUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { savedBooks: { ...book } } },
        { new: true }
      );
      return foundUser;
    },
  },
};

export default resolvers;
