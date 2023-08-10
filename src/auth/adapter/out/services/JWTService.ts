import { JWTServiceI } from "../../../application/port/out/JWTServiceI";
import * as jwt from "jsonwebtoken";

export class JWTService implements JWTServiceI {
  private secret: string;
  constructor() {
    this.secret = process.env.SECRET_KEY?.replace(
      /\\n/gm,
      "\n"
    ) as unknown as string;
  }
  encode(payload: any): string {
    const token = jwt.sign(payload, this.secret, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    return token;
  }
  decode(token: string): any {
    try {
      const payload = jwt.verify(token, this.secret);
      return payload;
    } catch (error) {
      console.log("error decoding token: ", error);
      return undefined;
    }
  }
}
