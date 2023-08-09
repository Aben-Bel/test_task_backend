export default class Verification {
  private _email: string;
  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }
  private _secret: string;
  public get secret(): string {
    return this._secret;
  }
  public set secret(value: string) {
    this._secret = value;
  }

  constructor(email: string, secret: string) {
    this._email = email;
    this._secret = secret;
  }
}
