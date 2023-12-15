import mongoose from "mongoose";
import { config } from "dotenv";
config();

const MONGO_URL: string = String(process.env.MONGO_URL);
//database connection using mongoose
export const mongooseConnect = async () => {
  try {
    MONGO_URL && (await mongoose.connect(MONGO_URL));
    console.log("User Database connected succesfully");
  } catch (error) {
    console.error(error);
  }
};

