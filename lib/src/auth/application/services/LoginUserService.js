"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserService = void 0;
class LoginUserService {
    constructor(loadUserPort, hashService, generateOTPQRCodeService) {
        this.loadUserPort = loadUserPort;
        this.hashService = hashService;
        this.generateOTPQRCodeService = generateOTPQRCodeService;
    }
    async loginUser(loginUser) {
        const user = await this.loadUserPort.loadUser(loginUser.email);
        if (!user) {
            throw new Error("Invalid email or password");
        }
        if (!(await this.hashService.compare(loginUser.password, user.password))) {
            throw new Error("Invalid email or password");
        }
        const res = await this.generateOTPQRCodeService.generateQRCode(user.email);
        return res;
    }
}
exports.LoginUserService = LoginUserService;
