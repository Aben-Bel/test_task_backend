import Joi from "joi";

export class ChangePasswordCommand {
  oldPassword: string;
  newPassword: string;
  email: string;
  constructor(oldPassword: string, newPassword: string, email: string) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.email = email;

    Joi.object({
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    }).validate({ password: this.newPassword });
  }
}
