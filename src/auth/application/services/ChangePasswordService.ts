import { ChangePasswordUseCase } from "../port/in/usecase/ChangePasswordUseCase";
import { ChangePasswordCommand } from "../port/in/command/ChangePasswordCommand";
import { LoadUserPort } from "../port/out/LoadUserPort";
import { ChangePasswordPort } from "../port/out/ChangePasswordPort";
import User from "../../domain/User";
import { HashService } from "../port/out/HashString";

/**
 * This class implements the ChangePasswordUseCase.
 *
 * The `loadUserPort` dependency is used to load a user by email.
 * The `changePasswordPort` dependency is used to change a user's password.
 * The `hashService` dependency is used to hash passwords.
 */
export class ChangePasswordService implements ChangePasswordUseCase {
  private loadUserPort: LoadUserPort;
  private changePasswordPort: ChangePasswordPort;
  private hashService: HashService;

  constructor(
    loadUserPort: LoadUserPort,
    changePasswordPort: ChangePasswordPort,
    hashService: HashService
  ) {
    this.loadUserPort = loadUserPort;
    this.changePasswordPort = changePasswordPort;
    this.hashService = hashService;
  }

  async changePassword(
    changePassword: ChangePasswordCommand
  ): Promise<boolean> {
    // Load the user from the database.
    const user = await this.loadUserPort.loadUser(changePassword.email);
    if (!user) {
      throw new Error("User doesn't exist");
    }

    // Check if the old password matches the user's current password.
    if (!this.hashService.compare(changePassword.oldPassword, user.password)) {
      throw new Error("Credentials mismatch");
    }

    // Hash the new password and change the user's password in the database.
    await this.changePasswordPort.changePassword(
      changePassword.email,
      await this.hashService.hash(changePassword.newPassword)
    );
    return true;
  }
}
