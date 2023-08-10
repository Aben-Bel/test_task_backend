import { GenerateOTPQRCodeService } from "../../../application/port/out/GenerateOTPQRCodeService";
import { UpdateOrInsertVerifyInfoPort } from "../../../application/port/out/UpdateOrInsertVerifyInfoPort";
import * as speakeasy from "speakeasy";
import * as QRCode from "qrcode";

export class GenerateOTPQRCode implements GenerateOTPQRCodeService {
  private updateOrInsertVerifyInfoPort: UpdateOrInsertVerifyInfoPort;

  constructor(updateOrInsertVerifyInfo: UpdateOrInsertVerifyInfoPort) {
    this.updateOrInsertVerifyInfoPort = updateOrInsertVerifyInfo;
  }

  async generateQRCode(email: string): Promise<string> {
    const secret: any = speakeasy.generateSecret();
    await this.updateOrInsertVerifyInfoPort.updateOrInsertVerifyInfo(
      email,
      secret.base32
    );

    return QRCode.toDataURL(secret.otpauth_url);
  }
}
