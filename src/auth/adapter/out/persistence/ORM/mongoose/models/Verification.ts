import { model, Schema } from "mongoose";
import { VerificationMongoDB } from "./Verification.model";

export const schema = new Schema<VerificationMongoDB>({
  secret: { type: String, required: true },
  email: { type: String, required: true },
});

export const VerificationModelSchema = model<VerificationMongoDB>(
  "Verifications",
  schema
);
