import UserRouter from "./auth/adapter/in/REST/routers/user.router";
import { UserRepository } from "./auth/adapter/out/persistence/ORM/mongoose/UserRepository";
import { UserMapper } from "./auth/adapter/out/persistence/UserMapper";
import { UserPersistenceAdapter } from "./auth/adapter/out/persistence/UserPersistenceAdapter";
import { GenerateOTPQRCode } from "./auth/adapter/out/services/GenerateOTPQRCodeService";
import { HashString } from "./auth/adapter/out/services/HashService";
import { LoginUserUseCase } from "./auth/application/port/in/usecase/LoginUserUseCase";
import { UserRegisterUseCase } from "./auth/application/port/in/usecase/UserRegisterUseCase";
import { VerifyTokenUseCase } from "./auth/application/port/in/usecase/VerifyTokenUseCase";
import { LoginUserService } from "./auth/application/services/LoginUserService";
import { UserRegisterService } from "./auth/application/services/UserRegisterService";
import { VerifyTokenService } from "./auth/application/services/VerifyTokenService";
import server from "./express_server";
import { connect } from "mongoose";
import { ResolverCreator } from "./auth/adapter/in/GraphQL/resolver";
import typeDefs from "./auth/adapter/in/GraphQL/models/typedefs";
import { ApolloServer } from "@apollo/server";
import { JWTService } from "./auth/adapter/out/services/JWTService";
import { ChangePasswordUseCase } from "./auth/application/port/in/usecase/ChangePasswordUseCase";
import { ChangePasswordService } from "./auth/application/services/ChangePasswordService";
import { NextFunction, Request, Response } from "express";
import { startStandaloneServer } from "@apollo/server/standalone";

(async () => {
  // Declare the user repository and mapper objects.
  const userRepository = new UserRepository();
  const userMapper = new UserMapper();

  // Declare the hash service and JWT service.
  const hashService = new HashString();
  const jwtService = new JWTService();

  // Declare the user adapter persistence object.
  const userAdapterPersistence: UserPersistenceAdapter =
    new UserPersistenceAdapter(userRepository, userMapper);

  // Declare the generate OTP QR code service.
  const generateOTPQRCodeService = new GenerateOTPQRCode(
    userAdapterPersistence
  );

  // Declare the usecases Login, Register, Verify, ChangePassword
  const loginUser: LoginUserUseCase = new LoginUserService(
    userAdapterPersistence,
    hashService,
    generateOTPQRCodeService
  );
  const signUpUser: UserRegisterUseCase = new UserRegisterService(
    userAdapterPersistence,
    userAdapterPersistence,
    hashService
  );
  const verifyUser: VerifyTokenUseCase = new VerifyTokenService(
    userAdapterPersistence,
    userAdapterPersistence,
    jwtService
  );
  const changePassword: ChangePasswordUseCase = new ChangePasswordService(
    userAdapterPersistence,
    userAdapterPersistence,
    hashService
  );

  // Declare the verify token util
  const validateToken = async (token: string) => {
    try {
      token = token.split(" ")[1];
      const result: any = jwtService.decode(token);
      if (result && result.email) {
        const user = await userAdapterPersistence.loadUser(result.email);
        if (user) {
          return user;
        } else {
          return undefined;
        }
      }
      return undefined;
    } catch (e: any) {
      console.log("error validating token: " + e.message);
      return undefined;
    }
  };

  // Declare the auth guard function to guard endpoints that require authentication.
  const authGuard = async (req: any, res: Response, next: NextFunction) => {
    const authToken = req.get("authorization");
    if (authToken) {
      const user = await validateToken(authToken);
      if (user) {
        req.user = user;
        next();
      } else {
        return res.status(401).send({ error: "Invalid token" });
      }
    } else {
      return res.status(403).json({ error: "No credentials" });
    }
  };

  // Declear our router middleware
  const userMiddleWare = UserRouter(
    loginUser,
    signUpUser,
    verifyUser,
    changePassword,
    authGuard
  );

  // setup REST and GRAPHQL servers
  const url: any = process.env.MONGODB_URI || "";
  const resolversCreator = new ResolverCreator(
    loginUser,
    signUpUser,
    verifyUser,
    changePassword,
    validateToken
  );
  const resolvers = resolversCreator.createResolver();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError, error) => {
      console.log(formattedError);
      if (formattedError.message.includes("User already exists")) {
        return { message: "User Already exists" };
      } else if (formattedError.message.includes("Not Authrized")) {
        return { message: "Invalid Token" };
      } else {
        return { message: "Server Error" };
      }
    },
  });

  server.use("/user", userMiddleWare);
  connect(url).then(() => {
    const PORT = 4545;
    console.log("connected to mongodb");
    server.listen(PORT, () =>
      console.log(`Running REST Server at port: ${PORT}`)
    );
  });

  await startStandaloneServer(apolloServer, {
    context: async ({ req, res }) => {
      return {
        ...req,
        headers: {
          ...req.headers,
          "x-apollo-operation-name": req.method + " " + req.url,
        },
      };
    },
  });
})();
