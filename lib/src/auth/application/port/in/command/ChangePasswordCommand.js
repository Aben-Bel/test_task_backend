"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordCommand = void 0;
const joi_1 = __importDefault(require("joi"));
class ChangePasswordCommand {
    constructor(oldPassword, newPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        joi_1.default.object({
            password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        }).validate({ password: this.newPassword });
    }
}
exports.ChangePasswordCommand = ChangePasswordCommand;
