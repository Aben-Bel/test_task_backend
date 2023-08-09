import User from "../../domain/User";
import { RegisterUserCommand } from "../port/in/command/RegisterUserCommand";
import { UserRegisterUseCase } from "../port/in/usecase/UserRegisterUseCase";
import { HashService } from "../port/out/HashString";
import { LoadUserPort } from "../port/out/LoadUserPort";
import { RegisterUserPort } from "../port/out/RegisterUserPort";

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

  async registerUser(
    userRegisterCommand: RegisterUserCommand
  ): Promise<boolean | Error> {
    const user: User = await this.loadUserPort.loadUser(
      userRegisterCommand.email
    );
    console.log("loaded user: " + user);
    if (user) throw new Error("User already exists");

    return await this.registerUserPort.registerUser(
      userRegisterCommand.email,
      await this.hashService.hash(userRegisterCommand.password)
    );
  }
}
