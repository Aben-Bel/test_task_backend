"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterService = void 0;
class UserRegisterService {
    constructor(registerUserPort, loadUserPort, hashService) {
        this.registerUserPort = registerUserPort;
        this.loadUserPort = loadUserPort;
        this.hashService = hashService;
    }
    async registerUser(userRegisterCommand) {
        const user = await this.loadUserPort.loadUser(userRegisterCommand.email);
        console.log("loaded user: " + user);
        if (user)
            throw new Error("User already exists");
        return await this.registerUserPort.registerUser(userRegisterCommand.email, await this.hashService.hash(userRegisterCommand.password));
    }
}
exports.UserRegisterService = UserRegisterService;
