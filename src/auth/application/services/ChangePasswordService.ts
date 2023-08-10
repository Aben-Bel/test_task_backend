import { ChangePasswordUseCase } from "../port/in/usecase/ChangePasswordUseCase";
import { ChangePasswordCommand } from "../port/in/command/ChangePasswordCommand";
import { LoadUserPort } from "../port/out/LoadUserPort";
import { ChangePasswordPort } from "../port/out/ChangePasswordPort";
import User from "../../domain/User";
import { HashService } from "../port/out/HashString";

export class ChangePasswordService implements ChangePasswordUseCase {
  private loadUserPort: LoadUserPort;
  private changePasswordPort: ChangePasswordPort;
  private hashService: HashService;

  constructor(
    loadUserPort: LoadUserPort,
    changePasswordPort: ChangePasswordPort,
    hashService: HashService
  ) {
    this.changePasswordPort = changePasswordPort;
    this.loadUserPort = loadUserPort;
    this.hashService = hashService;
  }
  async changePassword(
    changePassword: ChangePasswordCommand
  ): Promise<boolean> {
    const user: User = await this.loadUserPort.loadUser(changePassword.email);
    if (!user) {
      throw new Error("User doesn't exist");
    }
    if (
      !(await this.hashService.compare(
        changePassword.oldPassword,
        user.password
      ))
    ) {
      throw new Error("credentials mismatch");
    }

    await this.changePasswordPort.changePassword(
      changePassword.email,
      await this.hashService.hash(changePassword.newPassword)
    );
    return true;
  }
}
