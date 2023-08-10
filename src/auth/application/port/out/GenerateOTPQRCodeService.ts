export interface GenerateOTPQRCodeService {
  generateQRCode(email: string): Promise<string>;
}
