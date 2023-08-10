import { LoginUserCommand } from "../port/in/command/LoginUserCommand";
import { LoginUserUseCase } from "../port/in/usecase/LoginUserUseCase";
import { LoadUserPort } from "../port/out/LoadUserPort";
import User from "../../domain/User";
import { HashService } from "../port/out/HashString";
import { GenerateOTPQRCodeService } from "../port/out/GenerateOTPQRCodeService";

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

  async loginUser(loginUser: LoginUserCommand): Promise<string> {
    const user: User = await this.loadUserPort.loadUser(loginUser.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (!(await this.hashService.compare(loginUser.password, user.password))) {
      throw new Error("Invalid email or password");
    }

    const res = await this.generateOTPQRCodeService.generateQRCode(user.email);
    return res;
  }
}
