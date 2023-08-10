import { ChangePasswordCommand } from "../../../application/port/in/command/ChangePasswordCommand";
import { LoginUserCommand } from "../../../application/port/in/command/LoginUserCommand";
import { RegisterUserCommand } from "../../../application/port/in/command/RegisterUserCommand";
import { VerifyTokenCommand } from "../../../application/port/in/command/VerifyTokenCommand";
import { ChangePasswordUseCase } from "../../../application/port/in/usecase/ChangePasswordUseCase";
import { LoginUserUseCase } from "../../../application/port/in/usecase/LoginUserUseCase";
import { UserRegisterUseCase } from "../../../application/port/in/usecase/UserRegisterUseCase";
import { VerifyTokenUseCase } from "../../../application/port/in/usecase/VerifyTokenUseCase";

export class ResolverCreator {
  private loginService: LoginUserUseCase;
  private registerService: UserRegisterUseCase;
  private verifyTokenService: VerifyTokenUseCase;
  private changePasswordService: ChangePasswordUseCase;
  private validateToken: any;
  constructor(
    loginService: LoginUserUseCase,
    registerService: UserRegisterUseCase,
    verifyTokenService: VerifyTokenUseCase,
    changePasswordService: ChangePasswordUseCase,
    validateToken: any
  ) {
    this.loginService = loginService;
    this.registerService = registerService;
    this.verifyTokenService = verifyTokenService;
    this.changePasswordService = changePasswordService;
    this.validateToken = validateToken;
  }

  createResolver() {
    const resolvers = {
      Query: {
        login: async (_: any, params: any) => {
          try {
            const { email, password } = params;
            const loginCommand: LoginUserCommand = new LoginUserCommand(
              email,
              password
            );
            const result = await this.loginService.loginUser(loginCommand);
            return result;
          } catch (err: any) {
            throw new Error(err.message);
          }
        },
        verify: async (_: any, params: any) => {
          try {
            const { email, token } = params;
            const verifyToken: VerifyTokenCommand = new VerifyTokenCommand(
              email,
              token
            );
            const result = await this.verifyTokenService.verifyToken(
              verifyToken
            );
            return result;
          } catch (e: any) {
            throw new Error(e.message);
          }
        },
      },

      Mutation: {
        create: async (
          parent: any,
          args: { email: string; password: string }
        ) => {
          const { email, password } = args;
          const registerCommand: RegisterUserCommand = new RegisterUserCommand(
            email,
            password
          );
          try {
            const result: any = await this.registerService.registerUser(
              registerCommand
            );
            return result;
          } catch (err: any) {
            if (err.message === "User already exists") {
              return { Error: "User already exists" };
            }
            return { Error: "Server Error" };
          }
        },
        change: async (
          parent: any,
          args: { email: string; newPassword: string; oldPassword: string },
          context: any
        ) => {
          const { email, newPassword, oldPassword } = args;
          const authorizationHeader = context.headers.authorization;
          const user = await this.validateToken(authorizationHeader);
          if (!user || user.email !== email) {
            return { Error: "Not Authrized" };
          }
          const changePasswordCommand = new ChangePasswordCommand(
            oldPassword,
            newPassword,
            email
          );

          try {
            const changed = await this.changePasswordService.changePassword(
              changePasswordCommand
            );
            return changed;
          } catch (e) {
            return { Error: "Cannot Change Password" };
          }
        },
      },
    };
    return resolvers;
  }
}
