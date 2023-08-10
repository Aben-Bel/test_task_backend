"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordService = void 0;
/**
 * This class implements the ChangePasswordUseCase.
 *
 * The `loadUserPort` dependency is used to load a user by email.
 * The `changePasswordPort` dependency is used to change a user's password.
 * The `hashService` dependency is used to hash passwords.
 */
class ChangePasswordService {
    constructor(loadUserPort, changePasswordPort, hashService) {
        this.loadUserPort = loadUserPort;
        this.changePasswordPort = changePasswordPort;
        this.hashService = hashService;
    }
    async changePassword(changePassword) {
        // Load the user from the database.
        const user = await this.loadUserPort.loadUser(changePassword.email);
        if (!user) {
            throw new Error("User doesn't exist");
        }
        // Check if the old password matches the user's current password.
        if (!this.hashService.compare(changePassword.oldPassword, user.password)) {
            throw new Error("Credentials mismatch");
        }
        // Hash the new password and change the user's password in the database.
        await this.changePasswordPort.changePassword(changePassword.email, await this.hashService.hash(changePassword.newPassword));
        return true;
    }
}
exports.ChangePasswordService = ChangePasswordService;
