"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LoginUserCommand_1 = require("../../../../application/port/in/command/LoginUserCommand");
const RegisterUserCommand_1 = require("../../../../application/port/in/command/RegisterUserCommand");
const VerifyTokenCommand_1 = require("../../../../application/port/in/command/VerifyTokenCommand");
function UserRouter(loginUser, signupUser, verifyUser) {
    const router = express_1.default.Router();
    router.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;
            const loginCommand = new LoginUserCommand_1.LoginUserCommand(email, password);
            const result = await loginUser.loginUser(loginCommand);
            res.send(result);
        }
        catch (err) {
            console.log("error: ", err);
            res.status(500).send({ message: "Error signing user" });
        }
    });
    router.post("/signup", async (req, res) => {
        try {
            const { email, password } = req.body;
            const registerCommand = new RegisterUserCommand_1.RegisterUserCommand(email, password);
            const result = await signupUser.registerUser(registerCommand);
            res.send(result);
        }
        catch (e) {
            if (e.message === "User already exists")
                res.status(409).send(e.message);
            res.status(500).send({ message: "Couldn't signup user" });
        }
    });
    router.post("/verify", async (req, res) => {
        try {
            const { email, token } = req.body;
            const verifyToken = new VerifyTokenCommand_1.VerifyTokenCommand(email, token);
            console.log("verifyToken", verifyToken);
            const result = await verifyUser.verifyToken(verifyToken);
            console.log("verification result: ", result);
            res.send(result);
        }
        catch (e) {
            console.log("error: ", e);
            res.status(500).send({ message: "Couldn't verify user" });
        }
    });
    return router;
}
exports.default = UserRouter;
