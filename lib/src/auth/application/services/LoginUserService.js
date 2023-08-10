"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserService = void 0;
/**
 * This class implements the LoginUserUseCase.
 *
 * The `loadUserPort` dependency is used to load a user by email.
 * The `hashService` dependency is used to hash passwords.
 * The `generateOTPQRCodeService` dependency is used to generate an OTP QR code.
 */
class LoginUserService {
    constructor(loadUserPort, hashService, generateOTPQRCodeService) {
        this.loadUserPort = loadUserPort;
        this.hashService = hashService;
        this.generateOTPQRCodeService = generateOTPQRCodeService;
    }
    /**
     * Logs in the user with the specified email address and password.
     *
     * @param loginUser The login user command.
     * @returns The OTP QR code.
     */
    async loginUser(loginUser) {
        // Load the user from the database.
        const user = await this.loadUserPort.loadUser(loginUser.email);
        if (!user) {
            throw new Error("Invalid email or password");
        }
        // Check if the password matches the user's password.
        if (!(await this.hashService.compare(loginUser.password, user.password))) {
            throw new Error("Invalid email or password");
        }
        // Generate an OTP QR code for the user.
        const res = await this.generateOTPQRCodeService.generateQRCode(user.email);
        return res;
    }
}
exports.LoginUserService = LoginUserService;
