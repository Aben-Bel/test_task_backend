export interface JWTServiceI {
  encode(payload: any): string;
  decode(token: string): any;
}
