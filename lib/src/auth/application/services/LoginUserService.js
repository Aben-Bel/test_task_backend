"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserService = void 0;
const speakeasy = __importStar(require("speakeasy"));
const QRCode = __importStar(require("qrcode"));
class LoginUserService {
    constructor(loadUserPort, updateOrInsertVerifyInfoPort, hashService) {
        this.loadUserPort = loadUserPort;
        this.updateOrInsertVerifyInfoPort = updateOrInsertVerifyInfoPort;
        this.hashService = hashService;
    }
    async loginUser(loginUser) {
        const user = await this.loadUserPort.loadUser(loginUser.email);
        if (!user) {
            throw new Error("Invalid email or password");
        }
        if (user.password == (await this.hashService.hash(loginUser.password))) {
            throw new Error("Invalid email or password");
        }
        const res = await this.generateQRCode(user.email);
        console.log(res);
        return res;
    }
    async generateQRCode(email) {
        const secret = speakeasy.generateSecret();
        await this.updateOrInsertVerifyInfoPort.updateOrInsertVerifyInfo(email, secret.base32);
        return QRCode.toDataURL(secret.otpauth_url);
    }
}
exports.LoginUserService = LoginUserService;
