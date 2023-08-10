import User from "../../domain/User";
import { RegisterUserCommand } from "../port/in/command/RegisterUserCommand";
import { UserRegisterUseCase } from "../port/in/usecase/UserRegisterUseCase";
import { HashService } from "../port/out/HashString";
import { LoadUserPort } from "../port/out/LoadUserPort";
import { RegisterUserPort } from "../port/out/RegisterUserPort";

/**
 * This class implements the UserRegisterUseCase.
 *
 * The `registerUserPort` dependency is used to register a user.
 * The `loadUserPort` dependency is used to load a user by email.
 * The `hashService` dependency is used to hash passwords.
 */
export class UserRegisterService implements UserRegisterUseCase {
  private registerUserPort: RegisterUserPort;
  private loadUserPort: LoadUserPort;
  private hashService: HashService;

  constructor(
    registerUserPort: RegisterUserPort,
    loadUserPort: LoadUserPort,
    hashService: HashService
  ) {
    this.registerUserPort = registerUserPort;
    this.loadUserPort = loadUserPort;
    this.hashService = hashService;
  }

  /**
   * Registers a new user.
   *
   * @param userRegisterCommand The user register command.
   * @returns A promise that resolves to true if the user was registered successfully, or rejects with an error if an error occurred.
   */
  async registerUser(
    userRegisterCommand: RegisterUserCommand
  ): Promise<boolean | Error> {
    // Check if the user already exists.
    const user: User = await this.loadUserPort.loadUser(
      userRegisterCommand.email
    );
    if (user) throw new Error("User already exists");

    // Hash the password.
    const hashedPassword = await this.hashService.hash(
      userRegisterCommand.password
    );

    // Register the user.
    return await this.registerUserPort.registerUser(
      userRegisterCommand.email,
      hashedPassword
    );
  }
}
