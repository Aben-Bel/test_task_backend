import Joi from "joi";

export class RegisterUserCommand {
  email: string;
  password: string;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;

    Joi.object({
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      email: Joi.string().email(),
    }).validate({ email: this.email, password: this.password });
  }
}
