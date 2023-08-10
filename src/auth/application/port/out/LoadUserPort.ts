import User from "../../../domain/User";

export interface LoadUserPort {
  loadUser(email: string): Promise<User>;
}
