export interface RegisterUserPort {
  registerUser(email: string, password: string): Promise<boolean>;
}
