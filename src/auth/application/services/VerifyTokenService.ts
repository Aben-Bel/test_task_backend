import { VerifyTokenCommand } from "../port/in/command/VerifyTokenCommand";
import { VerifyTokenUseCase } from "../port/in/usecase/VerifyTokenUseCase";
import { LoadUserPort } from "../port/out/LoadUserPort";
import { LoadVerifyInfoPort } from "../port/out/LoadVerifyInfoPort";
import * as speakeasy from "speakeasy";
import Verification from "../../domain/Verification";
import { JWTServiceI } from "../port/out/JWTServiceI";

/**
 * This class implements the VerifyTokenUseCase.
 *
 * The `loadUserPort` dependency is used to load a user by email.
 * The `loadVerifyInfoPort` dependency is used to load verification information for a user.
 * The `speakeasy` dependency is used to verify TOTP tokens.
 * The `JWTServiceI` dependency is used to generate JWT tokens.
 */
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

  /**
   * Verifies a token for a user.
   *
   * @param verifyToken The verify token command.
   * @returns A promise that resolves to the JWT token if the token is valid, or rejects with an error if the token is invalid.
   */
  async verifyToken(verifyToken: VerifyTokenCommand): Promise<string> {
    // Load the user from the database.
    const user = await this.loadUserPort.loadUser(verifyToken.email);
    if (!user) {
      throw new Error("Invalid email or token");
    }

    // Load the verification information for the user.
    const verifyInfo: Verification =
      await this.loadVerifyInfoPort.loadVerifyInfo(verifyToken.email);
    if (!verifyInfo) {
      throw new Error("Invalid email or token");
    }

    // Verify the token.
    const verified = speakeasy.totp.verifyDelta({
      secret: verifyInfo.secret,
      encoding: "base32",
      token: verifyToken.token,
    });
    if (!verified) {
      throw new Error("Invalid email or token");
    }

    // Generate a JWT token for the user.
    const jwtToken = this.jwtService.encode({ email: user.email });
    return jwtToken;
  }
}
