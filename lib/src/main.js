"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_router_1 = __importDefault(require("./auth/adapter/in/REST/routers/user.router"));
const UserRepository_1 = require("./auth/adapter/out/persistence/ORM/mongoose/UserRepository");
const UserMapper_1 = require("./auth/adapter/out/persistence/UserMapper");
const UserPersistenceAdapter_1 = require("./auth/adapter/out/persistence/UserPersistenceAdapter");
const GenerateOTPQRCodeService_1 = require("./auth/adapter/out/services/GenerateOTPQRCodeService");
const HashService_1 = require("./auth/adapter/out/services/HashService");
const LoginUserService_1 = require("./auth/application/services/LoginUserService");
const UserRegisterService_1 = require("./auth/application/services/UserRegisterService");
const VerifyTokenService_1 = require("./auth/application/services/VerifyTokenService");
const express_server_1 = __importDefault(require("./express_server"));
const mongoose_1 = require("mongoose");
const resolver_1 = require("./auth/adapter/in/GraphQL/resolver");
const typedefs_1 = __importDefault(require("./auth/adapter/in/GraphQL/models/typedefs"));
const server_1 = require("@apollo/server");
const JWTService_1 = require("./auth/adapter/out/services/JWTService");
const ChangePasswordService_1 = require("./auth/application/services/ChangePasswordService");
const standalone_1 = require("@apollo/server/standalone");
(async () => {
    const userRepository = new UserRepository_1.UserRepository();
    const userMapper = new UserMapper_1.UserMapper();
    const hashService = new HashService_1.HashString();
    const jwtService = new JWTService_1.JWTService();
    const userAdapterPersistence = new UserPersistenceAdapter_1.UserPersistenceAdapter(userRepository, userMapper);
    const generateOTPQRCodeService = new GenerateOTPQRCodeService_1.GenerateOTPQRCode(userAdapterPersistence);
    const loginUser = new LoginUserService_1.LoginUserService(userAdapterPersistence, hashService, generateOTPQRCodeService);
    const signUpUser = new UserRegisterService_1.UserRegisterService(userAdapterPersistence, userAdapterPersistence, hashService);
    const verifyUser = new VerifyTokenService_1.VerifyTokenService(userAdapterPersistence, userAdapterPersistence, jwtService);
    const changePassword = new ChangePasswordService_1.ChangePasswordService(userAdapterPersistence, userAdapterPersistence, hashService);
    const validateToken = async (token) => {
        try {
            token = token.split(" ")[1];
            const result = jwtService.decode(token);
            if (result && result.email) {
                const user = await userAdapterPersistence.loadUser(result.email);
                if (user) {
                    return user;
                }
                else {
                    return undefined;
                }
            }
            return undefined;
        }
        catch (e) {
            console.log("error validating token: " + e.message);
            return undefined;
        }
    };
    const authGuard = async (req, res, next) => {
        const authToken = req.get("authorization");
        if (authToken) {
            const user = await validateToken(authToken);
            if (user) {
                next();
            }
            else {
                return res.status(401).send({ error: "Invalid token" });
            }
        }
        else {
            return res.status(403).json({ error: "No credentials" });
        }
    };
    const userMiddleWare = (0, user_router_1.default)(loginUser, signUpUser, verifyUser, changePassword, authGuard);
    const url = process.env.MONGODB_URI || "";
    const resolversCreator = new resolver_1.ResolverCreator(loginUser, signUpUser, verifyUser, changePassword, validateToken);
    const resolvers = resolversCreator.createResolver();
    const apolloServer = new server_1.ApolloServer({
        typeDefs: typedefs_1.default,
        resolvers,
        formatError: (formattedError, error) => {
            console.log(formattedError);
            if (formattedError.message.includes("User already exists")) {
                return { message: "User Already exists" };
            }
            else if (formattedError.message.includes("Not Authrized")) {
                return { message: "Invalid Token" };
            }
            else {
                return { message: "Server Error" };
            }
        },
    });
    express_server_1.default.use("/user", userMiddleWare);
    (0, mongoose_1.connect)(url).then(() => {
        const PORT = 4545;
        console.log("connected to mongodb");
        express_server_1.default.listen(PORT, () => console.log(`Running REST Server at port: ${PORT}`));
    });
    await (0, standalone_1.startStandaloneServer)(apolloServer, {
        context: async ({ req, res }) => {
            return Object.assign(Object.assign({}, req), { headers: Object.assign(Object.assign({}, req.headers), { "x-apollo-operation-name": req.method + " " + req.url }) });
        },
    });
})();
