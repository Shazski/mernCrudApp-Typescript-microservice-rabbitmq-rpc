import { Request, Response } from "express";
import rabbitMqClient from "../rabbitmq/client";
import configRabbitmq from "../config/config.rabbitmq";
import { config } from "dotenv";
config();
import { sign, verify } from "jsonwebtoken";
const JWT_SECRET: string = String(process.env.JWT_SECRET);
const createToken = (email: string) => {
  return sign({ email }, JWT_SECRET, { expiresIn: "1d" });
};
export const getUserData = async (req: Request, res: Response) => {
  try {
    let response = await rabbitMqClient.produceAndWaitForReplay(
      "",
      configRabbitmq.rabbitMq.queue.user_queue,
      "getAllUserDetails"
    );
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(401)
        .send({ errorMessage: "Email or Password is missing." });
    }
    if (email !== "sharoonkp267@gmail.com" || password !== "sharoon") {
      return res.status(400).send({ errorMessage: "Wrong Credentials" });
    }
    if (email === "sharoonkp267@gmail.com" && password === "sharoon") {
      const token = createToken(email);
      res.cookie("admin_token", token, { maxAge: 1000 * 60 * 60 * 10 });
      res.status(200).json({ email });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await rabbitMqClient.produceAndWaitForReplay(
      userId,
      configRabbitmq.rabbitMq.queue.user_queue,
      "deleteUserWithId"
    );
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const getLoggedInAdmin = (req: Request, res: Response) => {
  try {
    if (!req.cookies.admin_token) {
      return res.status(401).json({ errorMessage: "No admin token found" });
    }

    const token = req.cookies.admin_token;

    const { email }: any = verify(token, JWT_SECRET);

    res.status(200).json(email);
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    let response: any = await rabbitMqClient.produceAndWaitForReplay(
      req.body,
      configRabbitmq.rabbitMq.queue.user_queue,
      "createNewUser"
    );
    if (response.errorMessage) {
      return res.status(409).json(response);
    }
    res.status(201).json(response);
  } catch (error) {
    res.status(409).json({ errorMessage: "username or email already taken" });
    console.log(error);
  }
};

export const editUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  console.log(userId, "user id")
  try {
    let response: any = await rabbitMqClient.produceAndWaitForReplay(
      {userId, data:req.body},
      configRabbitmq.rabbitMq.queue.user_queue,
      "editExistingUser"
    );
    if (response.errorMessage) {
      return res.status(409).json(response);
    }
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
};
