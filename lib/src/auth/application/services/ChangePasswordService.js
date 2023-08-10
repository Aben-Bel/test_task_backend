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
            throw new Error("User doesn't exist");
        }
        if (!(await this.hashService.compare(changePassword.oldPassword, user.password))) {
            throw new Error("credentials mismatch");
        }
        await this.changePasswordPort.changePassword(changePassword.email, await this.hashService.hash(changePassword.newPassword));
        return true;
    }
}
exports.ChangePasswordService = ChangePasswordService;
