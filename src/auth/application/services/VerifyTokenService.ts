import { VerifyTokenCommand } from "../port/in/command/VerifyTokenCommand";
import { VerifyTokenUseCase } from "../port/in/usecase/VerifyTokenUseCase";
import { LoadUserPort } from "../port/out/LoadUserPort";
import { LoadVerifyInfoPort } from "../port/out/LoadVerifyInfoPort";
import * as speakeasy from "speakeasy";
import Verification from "../../domain/Verification";
import { JWTServiceI } from "../port/out/JWTServiceI";

export class VerifyTokenService implements VerifyTokenUseCase {
  private loadUserPort: LoadUserPort;
  private loadVerifyInfoPort: LoadVerifyInfoPort;
  private jwtService: JWTServiceI;

  constructor(
    loadUserPort: LoadUserPort,
    loadVerifyInfoPort: LoadVerifyInfoPort,
    jwtService: JWTServiceI
  ) {
    this.loadUserPort = loadUserPort;
    this.loadVerifyInfoPort = loadVerifyInfoPort;
    this.jwtService = jwtService;
  }

  async verifyToken(verifyToken: VerifyTokenCommand): Promise<string> {
    const user = await this.loadUserPort.loadUser(verifyToken.email);
    if (!user) {
      throw new Error("Invalid email or token");
    }

    const verifyInfo: Verification =
      await this.loadVerifyInfoPort.loadVerifyInfo(verifyToken.email);
    if (!verifyInfo) {
      throw new Error("Invalid email or token");
    }
    const verified = speakeasy.totp.verifyDelta({
      secret: verifyInfo.secret,
      encoding: "base32",
      token: verifyToken.token,
    });
    if (!verified) {
      throw new Error("Invalid email or token");
    }

    const jwtToken = this.jwtService.encode({ email: user.email });
    return jwtToken;
  }
}
