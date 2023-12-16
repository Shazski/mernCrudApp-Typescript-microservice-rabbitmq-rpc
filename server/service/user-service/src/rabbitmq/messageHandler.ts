import mongoose from "mongoose";
import User from "../models/user.models";
import rabbitMQClient from "./client";
export default class messgaeHandler {
  static async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    try {
      let response: any = {};
      switch (operation) {
        case "getAllUserDetails":
          response = await User.find();
          break;
        case "deleteUserWithId":
          response = await User.findByIdAndDelete(data);
          break;
        case "createNewUser":
          response = await User.create({ ...data });
          break;
        case "editExistingUser":
          const id = data.userId;
          const userId = new mongoose.Types.ObjectId(id);
          response = await User.findOneAndUpdate(
            userId,
            { ...data.data },
            { new: true }
          );
          break;
        case "getUserDetailsWithId":
          const idData = data;
          const userIdData = new mongoose.Types.ObjectId(idData);
          response = await User.findById(userIdData);
          break;
        default:
          response = "request key is not found";
          break;
      }
      await rabbitMQClient.produceReply(response, correlationId, replyTo);
    } catch (error: any) {
      if (error.code === 11000) {
        await rabbitMQClient.produceReply(
          { errorMessage: "Username or email is already taken" },
          correlationId,
          replyTo
        );
      } else {
        console.log(error,"simpleerror");
      }
    }
  }
}
