import { HashService } from "../../../application/port/out/HashString";
import bcrypt from "bcrypt";

export class HashString implements HashService {
  async hash(value: string): Promise<string> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(value, saltRounds);
    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(value, hash);
    return result;
  }
}
