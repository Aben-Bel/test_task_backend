import { LoginUserCommand } from "../port/in/command/LoginUserCommand";
import { LoginUserUseCase } from "../port/in/usecase/LoginUserUseCase";
import { LoadUserPort } from "../port/out/LoadUserPort";
import * as speakeasy from "speakeasy";
import * as QRCode from "qrcode";
import { LoadVerifyInfoPort } from "../port/out/LoadVerifyInfoPort";
import { UpdateOrInsertVerifyInfoPort } from "../port/out/UpdateOrInsertVerifyInfoPort";
import User from "../../domain/User";
import { HashService } from "../port/out/HashString";

export class LoginUserService implements LoginUserUseCase {
  private loadUserPort: LoadUserPort;
  private updateOrInsertVerifyInfoPort: UpdateOrInsertVerifyInfoPort;
  private hashService: HashService;

  constructor(
    loadUserPort: LoadUserPort,
    updateOrInsertVerifyInfoPort: UpdateOrInsertVerifyInfoPort,
    hashService: HashService
  ) {
    this.loadUserPort = loadUserPort;
    this.updateOrInsertVerifyInfoPort = updateOrInsertVerifyInfoPort;
    this.hashService = hashService;
  }

  async loginUser(loginUser: LoginUserCommand): Promise<any> {
    const user: User = await this.loadUserPort.loadUser(loginUser.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (user.password == (await this.hashService.hash(loginUser.password))) {
      throw new Error("Invalid email or password");
    }

    const res = await this.generateQRCode(user.email);
    console.log(res);
    return res;
  }

  async generateQRCode(email: string): Promise<any> {
    const secret: any = speakeasy.generateSecret();
    await this.updateOrInsertVerifyInfoPort.updateOrInsertVerifyInfo(
      email,
      secret.base32
    );

    return QRCode.toDataURL(secret.otpauth_url);
  }
}
