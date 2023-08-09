import { VerifyTokenCommand } from "../port/in/command/VerifyTokenCommand";
import { VerifyTokenUseCase } from "../port/in/usecase/VerifyTokenUseCase";
import { LoadUserPort } from "../port/out/LoadUserPort";
import { LoadVerifyInfoPort } from "../port/out/LoadVerifyInfoPort";
import * as speakeasy from "speakeasy";
import * as jwt from "jsonwebtoken";
import Verification from "../../domain/Verification";

export class VerifyTokenService implements VerifyTokenUseCase {
  private loadUserPort: LoadUserPort;
  private loadVerifyInfoPort: LoadVerifyInfoPort;

  constructor(
    loadUserPort: LoadUserPort,
    loadVerifyInfoPort: LoadVerifyInfoPort
  ) {
    this.loadUserPort = loadUserPort;
    this.loadVerifyInfoPort = loadVerifyInfoPort;
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
    console.log("vrified: " + verified);
    if (!verified) {
      throw new Error("Invalid email or token");
    }

    const jwtToken = jwt.sign({ email: user.email }, "secret", {
      expiresIn: "1h",
    });
    return jwtToken;
  }
}
