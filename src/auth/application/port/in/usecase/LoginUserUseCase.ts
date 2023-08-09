import { LoginUserCommand } from "../command/LoginUserCommand";

export interface LoginUserUseCase {
  loginUser(loginUser: LoginUserCommand): Promise<any>;
}
