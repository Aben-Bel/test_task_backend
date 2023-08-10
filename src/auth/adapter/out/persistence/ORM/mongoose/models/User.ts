import { model, Schema } from "mongoose";
import { UserMongoDB } from "./User.model";

export const schema = new Schema<UserMongoDB>({
  id: { type: String },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
});

export const UserModelSchema = model<UserMongoDB>("users", schema);
