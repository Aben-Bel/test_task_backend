"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_router_1 = __importDefault(require("./auth/adapter/in/web/routers/user.router"));
const UserRepository_1 = require("./auth/adapter/out/persistence/ORM/mongoose/UserRepository");
const UserMapper_1 = require("./auth/adapter/out/persistence/UserMapper");
const UserPersistenceAdapter_1 = require("./auth/adapter/out/persistence/UserPersistenceAdapter");
const HashService_1 = require("./auth/adapter/out/services/HashService");
const LoginUserService_1 = require("./auth/application/services/LoginUserService");
const UserRegisterService_1 = require("./auth/application/services/UserRegisterService");
const VerifyTokenUseCase_1 = require("./auth/application/services/VerifyTokenUseCase");
const server_1 = __importDefault(require("./server"));
const mongoose_1 = require("mongoose");
(async () => {
    const userRepository = new UserRepository_1.UserRepository();
    const userMapper = new UserMapper_1.UserMapper();
    const hashService = new HashService_1.HashString();
    const userAdapterPersistence = new UserPersistenceAdapter_1.UserPersistenceAdapter(userRepository, userMapper);
    const loginUser = new LoginUserService_1.LoginUserService(userAdapterPersistence, userAdapterPersistence, hashService);
    const signUpUser = new UserRegisterService_1.UserRegisterService(userAdapterPersistence, userAdapterPersistence, hashService);
    const verifyUser = new VerifyTokenUseCase_1.VerifyTokenService(userAdapterPersistence, userAdapterPersistence);
    const userMiddleWare = (0, user_router_1.default)(loginUser, signUpUser, verifyUser);
    const url = process.env.MONGODB_URI || "";
    server_1.default.use("/user", userMiddleWare);
    (0, mongoose_1.connect)(url).then(() => {
        const PORT = 4545;
        console.log("connected to mongodb");
        server_1.default.listen(PORT, () => console.log(`Running Server at port: ${PORT}`));
    });
})();
