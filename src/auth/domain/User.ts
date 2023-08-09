export default class User {
  private _id: string;
  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }
  private _email: string;
  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }
  private _password: string;
  public get password(): string {
    return this._password;
  }
  public set password(value: string) {
    this._password = value;
  }

  constructor(id: string, email: string, password: string) {
    this._email = email;
    this._password = password;
    this._id = id;
  }

  public checkEmailEquality(email: string): boolean {
    return email === this.email;
  }
}
