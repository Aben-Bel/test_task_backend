import { VerifyTokenCommand } from "../command/VerifyTokenCommand";

export interface VerifyTokenUseCase {
  verifyToken(verifyToken: VerifyTokenCommand): Promise<string>;
}
