import { UserModelSchema } from "../mongoose/models/User";
import { UserMongoDB } from "./models/User.model";
import { VerificationModelSchema } from "./models/Verification";
import { VerificationMongoDB } from "./models/Verification.model";

export class UserRepository {
  async loadVerification(email: string): Promise<VerificationMongoDB> {
    const verification: VerificationMongoDB =
      (await VerificationModelSchema.findOne({
        email: email,
      })) as VerificationMongoDB;
    return verification;
  }
  async updateVerification(email: string, secret: string): Promise<boolean> {
    const verification = await VerificationModelSchema.updateOne(
      { email: email },
      { $set: { secret: secret } },
      { upsert: true }
    );
    return true;
  }

  async getUserByEmail(email: string): Promise<UserMongoDB> {
    const user = (await UserModelSchema.findOne({
      email: email,
    })) as UserMongoDB;
    return user;
  }

  async addUser(email: string, password: string): Promise<boolean> {
    const user = await UserModelSchema.create({ email, password });
    const result = await user.save();
    return true;
  }

  async changePassword(email: string, password: string): Promise<boolean> {
    const user = await UserModelSchema.updateOne(
      { email: email },
      { $set: { password: password } }
    );

    return true;
  }
}
