import { LoginRequestDTO } from "@dtos/AuthDto";
import { AppError } from "@utils/AppError";
import { HashUtils } from "@utils/hash";
import type { StringValue } from "ms";
import jwt, { SignOptions } from "jsonwebtoken";
import { UsersRepository } from "@repositories/UsersRepository";

export class ShopKeeperAuthService {
  // login admin
  static async login(data: LoginRequestDTO): Promise<{ token: string }> {
    const user = await UsersRepository.findOneBy({ username: data.username });
    if (user && (await HashUtils.comparePassword(data.password, user.password))) {
      const expiresIn: StringValue = (
        process.env.JWT_EXPIRE_MINUTES
          ? `${process.env.JWT_EXPIRE_MINUTES}m`
          : "15m"
      ) as StringValue;
      const options: SignOptions = { expiresIn };
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || "defaultSecret",
        options
      );
      return { token };
    }
    throw new AppError("Invalid email or password", 401);
  }
}
