import { LoginUserCommand } from "../port/in/command/LoginUserCommand";
import { LoginUserUseCase } from "../port/in/usecase/LoginUserUseCase";
import { LoadUserPort } from "../port/out/LoadUserPort";
import User from "../../domain/User";
import { HashService } from "../port/out/HashString";
import { GenerateOTPQRCodeService } from "../port/out/GenerateOTPQRCodeService";

/**
 * This class implements the LoginUserUseCase.
 *
 * The `loadUserPort` dependency is used to load a user by email.
 * The `hashService` dependency is used to hash passwords.
 * The `generateOTPQRCodeService` dependency is used to generate an OTP QR code.
 */
export class LoginUserService implements LoginUserUseCase {
  private loadUserPort: LoadUserPort;
  private hashService: HashService;
  private generateOTPQRCodeService: GenerateOTPQRCodeService;

  constructor(
    loadUserPort: LoadUserPort,
    hashService: HashService,
    generateOTPQRCodeService: GenerateOTPQRCodeService
  ) {
    this.loadUserPort = loadUserPort;
    this.hashService = hashService;
    this.generateOTPQRCodeService = generateOTPQRCodeService;
  }

  /**
   * Logs in the user with the specified email address and password.
   *
   * @param loginUser The login user command.
   * @returns The OTP QR code.
   */
  async loginUser(loginUser: LoginUserCommand): Promise<string> {
    // Load the user from the database.
    const user: User = await this.loadUserPort.loadUser(loginUser.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if the password matches the user's password.
    if (!(await this.hashService.compare(loginUser.password, user.password))) {
      throw new Error("Invalid email or password");
    }

    // Generate an OTP QR code for the user.
    const res = await this.generateOTPQRCodeService.generateQRCode(user.email);
    return res;
  }
}
