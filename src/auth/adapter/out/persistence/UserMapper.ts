import User from "../../../domain/User";

export class UserMapper {
  mapToDomainEntity(user: any): any {
    return new User(user._id, user.email, user.password);
  }
}
