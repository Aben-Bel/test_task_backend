import UserRouter from "./auth/adapter/in/web/routers/user.router";
import { UserRepository } from "./auth/adapter/out/persistence/ORM/mongoose/UserRepository";
import { UserMapper } from "./auth/adapter/out/persistence/UserMapper";
import { UserPersistenceAdapter } from "./auth/adapter/out/persistence/UserPersistenceAdapter";
import { HashString } from "./auth/adapter/out/services/HashService";
import { LoginUserUseCase } from "./auth/application/port/in/usecase/LoginUserUseCase";
import { UserRegisterUseCase } from "./auth/application/port/in/usecase/UserRegisterUseCase";
import { VerifyTokenUseCase } from "./auth/application/port/in/usecase/VerifyTokenUseCase";
import { LoginUserService } from "./auth/application/services/LoginUserService";
import { UserRegisterService } from "./auth/application/services/UserRegisterService";
import { VerifyTokenService } from "./auth/application/services/VerifyTokenUseCase";
import server from "./server";
import { connect } from "mongoose";

(async () => {
  const userRepository = new UserRepository();
  const userMapper = new UserMapper();
  const hashService = new HashString();
  const userAdapterPersistence: UserPersistenceAdapter =
    new UserPersistenceAdapter(userRepository, userMapper);
  const loginUser: LoginUserUseCase = new LoginUserService(
    userAdapterPersistence,
    userAdapterPersistence,
    hashService
  );
  const signUpUser: UserRegisterUseCase = new UserRegisterService(
    userAdapterPersistence,
    userAdapterPersistence,
    hashService
  );
  const verifyUser: VerifyTokenUseCase = new VerifyTokenService(
    userAdapterPersistence,
    userAdapterPersistence
  );
  const userMiddleWare = UserRouter(loginUser, signUpUser, verifyUser);
  const url: any = process.env.MONGODB_URI || "";

  server.use("/user", userMiddleWare);
  connect(url).then(() => {
    const PORT = 4545;
    console.log("connected to mongodb");
    server.listen(PORT, () => console.log(`Running Server at port: ${PORT}`));
  });
})();
