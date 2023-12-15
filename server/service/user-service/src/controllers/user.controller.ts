import { Request, Response } from "express";
import User from "../models/user.models";
import { UserDocument } from "../models/user.models";
import { config } from "dotenv";
config();
import { compareSync } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
const JWT_SECRET: string = String(process.env.JWT_SECRET);

const createToken = (_id: string) => {
  return sign({ _id }, JWT_SECRET, { expiresIn: "1d" });
};
const cookieConfig = {
  secure: true,
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24,
  sameSite: false,
};

export const userRegister = async (req: Request, res: Response) => {
  console.log(req.body);
  const { username, email, password, profilePic }: UserDocument = req.body;
  if (!username || !email || !password || !profilePic)
    return res.status(400).send({ errorMessage: "Missing Fields" });
  try {
    const newUser = await User.create({
      username,
      email,
      password,
      profilePic,
    });

    const token = createToken(newUser._id);

    res.cookie("user_token", token, cookieConfig);
    newUser.token = token;
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.code === 11000) {
      // duplicate key error
      return res
        .status(409)
        .send({ errorMessage: `Email or Username is already taken` });
    } else {
      res
        .status(400)
        .json({ errorMessage: "Something went wrong please try again" });
    }
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ errorMessage: "Invalid Credentials" });
  try {
    const userExists = await User.findOne({ email });

    !userExists && res.status(400).json({ errorMessage: "Wrong Credentials" });

    if (userExists) {
      const passMatch = compareSync(password, userExists?.password);

      !passMatch && res.status(400).json({ errorMessage: "Wrong Credentials" });

      if (passMatch) {
        const token = createToken(userExists?._id);
        res.cookie("user_token", token, cookieConfig);
        const userData = userExists.toObject();
        userData.token = token;
        res.status(201).json(userData);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const getLoggedInUserData = async (req: Request, res: Response) => {
  if (!req.cookies.user_token) {
    return res.status(401).json({ errorMessage: "No token found" });
  }

  const token = req.cookies.user_token;

  const { _id }: any = verify(token, JWT_SECRET);

  const user = await User.findOne({ _id }, { password: 0 });

  res.status(200).json(user);
};
export const logoutUser = (req: Request, res: Response) => {
  res
    .clearCookie("user_token")
    .status(200)
    .json({ message: "Logged Out Successfully!" });
};

export const editCurrentUser = async (req: Request, res: Response) => {
  const token = req.cookies.user_token;
  const { _id }: any = verify(token, JWT_SECRET);
  const userId = _id || req.query.id;
  const { email, username } = req.body;
  const userCredentials = req.body
  if(!userCredentials.profilePic) {
    delete userCredentials.profilePic
  }
  if (!email || !username)
    return res.status(400).json({ errorMessage: "Provide all the data" });
  try {
    const editedUserDetails = await User.findByIdAndUpdate(
      userId,
      {...userCredentials},
      { new: true }
    );
    res.status(201).json(editedUserDetails);
  } catch (error: any) {
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ errorMessage: "Username or email already Taken" });
    }
    res.status(500).json({ errorMessage: "Server Error" });
  }
};
