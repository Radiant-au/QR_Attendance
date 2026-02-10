// src/services/AuthService.ts
import jwt, { SignOptions } from "jsonwebtoken";
import ms, { StringValue } from "ms";
import { UsersRepository } from "@repositories/UsersRepository";
import { AppError } from "@utils/AppError";
import { LoginRequestDTO } from "@dtos/AuthDto";
import { HashUtils } from "@utils/hash";
import { UserResponse } from "@dtos/UserDto";
import { UsersService } from "./UsersService";

export class AuthService {
  // ✅ Service only returns token and user data
  static async login(data: LoginRequestDTO): Promise<{ token: string , user: UserResponse}> {
    const user = await UsersRepository.findOneBy({ username: data.username });

    if (!user || !(await HashUtils.comparePassword(data.password, user.password))) {
      throw new AppError("Invalid username or password", 401);
    }

    // Generate JWT token
    const expiresIn : StringValue = (
      process.env.JWT_EXPIRE_MINUTES
        ? `${process.env.JWT_EXPIRE_MINUTES}m`
        : "15m"
    ) as StringValue;;

    const options: SignOptions = { expiresIn };
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "defaultSecret",
      options
    );

    const result : UserResponse = {
      id : user.id,
       username: user.username,
      role: user.role,
      fullName: user.fullName,
      major: user.major,
      isProfileCompleted: user.isProfileCompleted,
      year: user.year,
      createdAt: user.createdAt,
    }

    return {
      token,
      user : result,
    };
  }

  // ✅ Get current user (for /auth/me endpoint)
  static async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await UsersService.getUserById(userId);
    return user;
  }
}