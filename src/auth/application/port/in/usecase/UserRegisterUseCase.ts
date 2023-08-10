import { RegisterUserCommand } from "../command/RegisterUserCommand";

export interface UserRegisterUseCase {
  registerUser(
    userRegisterCommand: RegisterUserCommand
  ): Promise<boolean | Error>;
}
