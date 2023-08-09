import { ChangePasswordUseCase } from "../port/in/usecase/ChangePasswordUseCase";
import { ChangePasswordCommand } from "../port/in/command/ChangePasswordCommand";
import { LoadUserPort } from "../port/out/LoadUserPort";
import { ChangePasswordPort } from "../port/out/ChangePasswordPort";

class ChangePasswordService implements ChangePasswordUseCase {
  private loadUserPort: LoadUserPort;
  private changePasswordPort: ChangePasswordPort;
  constructor(
    loadUserPort: LoadUserPort,
    changePasswordPort: ChangePasswordPort
  ) {
    this.changePasswordPort = changePasswordPort;
    this.loadUserPort = loadUserPort;
  }
  changePassword(changePassword: ChangePasswordCommand): boolean {
    const value: any = undefined;
    return value;
  }
}
