import { ChangePasswordPort } from "../../../application/port/out/ChangePasswordPort";
import { LoadUserPort } from "../../../application/port/out/LoadUserPort";
import { RegisterUserPort } from "../../../application/port/out/RegisterUserPort";
import { UserMapper } from "./UserMapper";
import { UserRepository } from "./ORM/mongoose/UserRepository";
import User from "../../../domain/User";
import { LoadVerifyInfoPort } from "../../../application/port/out/LoadVerifyInfoPort";
import { UpdateOrInsertVerifyInfoPort } from "../../../application/port/out/UpdateOrInsertVerifyInfoPort";
import { UserMongoDB } from "./ORM/mongoose/models/User.model";
import Verification from "../../../domain/Verification";
import { VerificationMongoDB } from "./ORM/mongoose/models/Verification.model";

export class UserPersistenceAdapter
  implements
    LoadUserPort,
    RegisterUserPort,
    ChangePasswordPort,
    LoadVerifyInfoPort,
    UpdateOrInsertVerifyInfoPort
{
  private userRepo: UserRepository;
  private userMapper: UserMapper;

  constructor(userRepo: UserRepository, userMapper: UserMapper) {
    this.userRepo = userRepo;
    this.userMapper = userMapper;
  }

  async loadVerifyInfo(email: string) {
    try {
      const verification: VerificationMongoDB =
        await this.userRepo.loadVerification(email);
      return new Verification(verification.email, verification.secret);
    } catch (err) {
      throw err;
    }
  }

  async updateOrInsertVerifyInfo(email: string, secret: string) {
    try {
      const verification = await this.userRepo.updateVerification(
        email,
        secret
      );
      return true;
    } catch (e) {
      return false;
    }
  }
  
  async loadUser(email: string): Promise<any> {
    try {
      const user: UserMongoDB = await this.userRepo.getUserByEmail(email);
      if (user != undefined) {
        return this.userMapper.mapToDomainEntity(user);
      } else {
        return undefined;
      }
    } catch (e) {
      return e;
    }
  }

  async registerUser(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.userRepo.addUser(email, password);
      return true;
    } catch {
      return false;
    }
  }

  async changePassword(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.userRepo.changePassword(email, password);
      return true;
    } catch (e) {
      return false;
    }
  }
}
