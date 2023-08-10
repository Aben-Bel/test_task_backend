"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordService = void 0;
class ChangePasswordService {
    constructor(loadUserPort, changePasswordPort, hashService) {
        this.changePasswordPort = changePasswordPort;
        this.loadUserPort = loadUserPort;
        this.hashService = hashService;
    }
    async changePassword(changePassword) {
        const user = await this.loadUserPort.loadUser(changePassword.email);
        if (!user) {
            throw new Error("Invalid email or password");
        }
        if (!(await this.hashService.compare(changePassword.oldPassword, user.password))) {
            throw new Error("Invalid email or password");
        }
        await this.changePasswordPort.changePassword(changePassword.email, await this.hashService.hash(changePassword.newPassword));
        return true;
    }
}
exports.ChangePasswordService = ChangePasswordService;
