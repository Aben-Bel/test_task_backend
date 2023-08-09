import express from "express";
import { Request, Response } from "express";
import { LoginUserUseCase } from "../../../../application/port/in/usecase/LoginUserUseCase";
import { UserRegisterUseCase } from "../../../../application/port/in/usecase/UserRegisterUseCase";
import { LoginUserCommand } from "../../../../application/port/in/command/LoginUserCommand";
import { RegisterUserCommand } from "../../../../application/port/in/command/RegisterUserCommand";
import { VerifyTokenCommand } from "../../../../application/port/in/command/VerifyTokenCommand";
import { VerifyTokenUseCase } from "../../../../application/port/in/usecase/VerifyTokenUseCase";

export default function UserRouter(
  loginUser: LoginUserUseCase,
  signupUser: UserRegisterUseCase,
  verifyUser: VerifyTokenUseCase
) {
  const router = express.Router();

  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const loginCommand: LoginUserCommand = new LoginUserCommand(
        email,
        password
      );
      const result = await loginUser.loginUser(loginCommand);
      res.send(result);
    } catch (err) {
      console.log("error: ", err);
      res.status(500).send({ message: "Error signing user" });
    }
  });

  router.post("/signup", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const registerCommand: RegisterUserCommand = new RegisterUserCommand(
        email,
        password
      );
      const result = await signupUser.registerUser(registerCommand);
      res.send(result);
    } catch (e: any) {
      if (e.message === "User already exists") res.status(409).send(e.message);
      res.status(500).send({ message: "Couldn't signup user" });
    }
  });

  router.post("/verify", async (req: Request, res: Response) => {
    try {
      const { email, token } = req.body;
      const verifyToken: VerifyTokenCommand = new VerifyTokenCommand(
        email,
        token
      );
      console.log("verifyToken", verifyToken);
      const result = await verifyUser.verifyToken(verifyToken);
      console.log("verification result: ", result);
      res.send(result);
    } catch (e: any) {
      console.log("error: ", e);
      res.status(500).send({ message: "Couldn't verify user" });
    }
  });

  return router;
}
