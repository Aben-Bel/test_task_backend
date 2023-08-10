import { ChangePasswordCommand } from "../command/ChangePasswordCommand";

export interface ChangePasswordUseCase {
  changePassword(changePassword: ChangePasswordCommand): Promise<boolean>;
}
