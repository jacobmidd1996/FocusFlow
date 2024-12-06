import type { Request, Response } from "express";
// import user model
import User from "../models/User.js";
// import sign token function from auth
import { signToken } from "../services/auth.js";

// get a single user by either their id or their username
export const getSingleUser = async (req: Request, res: Response) => {
  const foundUser = await User.findOne({
    $or: [
      { _id: req.user ? req.user._id : req.params.id },
      { username: req.params.username },
    ],
  });

  if (!foundUser) {
    return res
      .status(400)
      .json({ message: "Cannot find a user with this id!" });
  }

  return res.json(foundUser);
};

// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
export const createUser = async (req: Request, res: Response) => {
  const user = await User.create(req.body);

  if (!user) {
    return res.status(400).json({ message: "Something is wrong!" });
  }
  const token = signToken(user.username, user.password, user._id);
  return res.json({ token, user });
};

// login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
// {body} is destructured req.body
export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (!user) {
    return res.status(400).json({ message: "Can't find this user" });
  }

  const correctPw = await user.isCorrectPassword(req.body.password);

  if (!correctPw) {
    return res.status(400).json({ message: "Wrong password!" });
  }
  const token = signToken(user.username, user.password, user._id);
  return res.json({ token, user });
};