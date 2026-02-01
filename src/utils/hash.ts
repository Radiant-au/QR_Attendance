import bcryptjs from "bcryptjs";

export class HashUtils {
  // Async password hashing
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcryptjs.hash(password, saltRounds);
  }

  // Async password comparison
  static async comparePassword(password: string, hashed: string): Promise<boolean> {
    return await bcryptjs.compare(password, hashed);
  }
}
