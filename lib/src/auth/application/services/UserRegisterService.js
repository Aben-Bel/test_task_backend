"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterService = void 0;
/**
 * This class implements the UserRegisterUseCase.
 *
 * The `registerUserPort` dependency is used to register a user.
 * The `loadUserPort` dependency is used to load a user by email.
 * The `hashService` dependency is used to hash passwords.
 */
class UserRegisterService {
    constructor(registerUserPort, loadUserPort, hashService) {
        this.registerUserPort = registerUserPort;
        this.loadUserPort = loadUserPort;
        this.hashService = hashService;
    }
    /**
     * Registers a new user.
     *
     * @param userRegisterCommand The user register command.
     * @returns A promise that resolves to true if the user was registered successfully, or rejects with an error if an error occurred.
     */
    async registerUser(userRegisterCommand) {
        // Check if the user already exists.
        const user = await this.loadUserPort.loadUser(userRegisterCommand.email);
        if (user)
            throw new Error("User already exists");
        // Hash the password.
        const hashedPassword = await this.hashService.hash(userRegisterCommand.password);
        // Register the user.
        return await this.registerUserPort.registerUser(userRegisterCommand.email, hashedPassword);
    }
}
exports.UserRegisterService = UserRegisterService;
