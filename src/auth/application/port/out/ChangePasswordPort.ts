import User from "../../../domain/User";

export interface ChangePasswordPort {
  changePassword(email: string, password: string): Promise<boolean>;
}
