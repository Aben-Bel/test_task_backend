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
exports.VerifyTokenService = void 0;
const speakeasy = __importStar(require("speakeasy"));
class VerifyTokenService {
    constructor(loadUserPort, loadVerifyInfoPort, jwtService) {
        this.loadUserPort = loadUserPort;
        this.loadVerifyInfoPort = loadVerifyInfoPort;
        this.jwtService = jwtService;
    }
    async verifyToken(verifyToken) {
        const user = await this.loadUserPort.loadUser(verifyToken.email);
        if (!user) {
            throw new Error("Invalid email or token");
        }
        const verifyInfo = await this.loadVerifyInfoPort.loadVerifyInfo(verifyToken.email);
        if (!verifyInfo) {
            throw new Error("Invalid email or token");
        }
        const verified = speakeasy.totp.verifyDelta({
            secret: verifyInfo.secret,
            encoding: "base32",
            token: verifyToken.token,
        });
        if (!verified) {
            throw new Error("Invalid email or token");
        }
        const jwtToken = this.jwtService.encode({ email: user.email });
        return jwtToken;
    }
}
exports.VerifyTokenService = VerifyTokenService;
