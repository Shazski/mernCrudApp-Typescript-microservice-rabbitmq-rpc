import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  profilePic: string;
  token?:string
}

const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String },
}, {
    timestamps:true
});

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, (err: any, hash: string) => {

    if (err) return next(err);

    user.password = hash;
    next();
  });
});

//prevent password sending to frontend
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const User = model<UserDocument>("User", UserSchema);

export default User;
