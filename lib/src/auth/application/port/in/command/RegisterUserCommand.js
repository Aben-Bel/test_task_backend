"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserCommand = void 0;
const joi_1 = __importDefault(require("joi"));
class RegisterUserCommand {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        joi_1.default.object({
            password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
            email: joi_1.default.string().email(),
        }).validate({ email: this.email, password: this.password });
    }
}
exports.RegisterUserCommand = RegisterUserCommand;
