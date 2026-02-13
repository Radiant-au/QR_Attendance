import { CreateUserRequestDto, OneUserResponse, UpdateUserRequestDto, UserResponse } from "@dtos/UserDto";
import { User } from "@entities/Users";
import { UsersRepository } from "@repositories/UsersRepository";
import { AppError } from "@utils/AppError";
import { HashUtils } from "@utils/hash";
import { QrSignature } from "@utils/Signature";

export class UsersService {

  static async getMyDynamicQr(userId: string) {
    // Verify user exists
    const user = await UsersRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate QR data (valid for 10 minutes)
    const qrToken = QrSignature.generateUserQrToken(userId);

    return qrToken;
  }

  // create 
  static async createUser(
    data: CreateUserRequestDto
  ): Promise<string> {

    const user = new User();
    user.username = data.username;
    user.password = await HashUtils.hashPassword(data.password);
    user.role = data.role;
    const result = await UsersRepository.save(user);

    return result ? "success" : "failed";
  }
  // read all 
  static async getAllUsers(): Promise<UserResponse[]> {
    const users = await UsersRepository.find();

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      major: user.major,
      isProfileCompleted: user.isProfileCompleted,
      year: user.year,
      createdAt: user.createdAt
    }))
  }

  // read one
  static async getUserById(id: string): Promise<OneUserResponse> {
    const user = await UsersRepository.findOne({ where : {id: id} , relations: ['registrations', 'attendances.activity']});

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      major: user.major,
      registrations: user.registrations.map(reg => reg.activityId),
      attendances: user.attendances.map((a) => ({
          actvityName: a.activity.title,
          isPresent: a.isPresent,
          scanMethod: a.scanMethod
      })),
      isProfileCompleted: user.isProfileCompleted,
      year: user.year,
      createdAt: user.createdAt,
    };
  }

  // update
  static async updateUser(
    id: string,
    data: UpdateUserRequestDto
  ): Promise<UserResponse> {
    const user = await UsersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    Object.assign(user, data);
    user.isProfileCompleted = data.fullName && data.major && data.year ? true : user.isProfileCompleted;

    const updatedUser = await UsersRepository.save(user);

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      role: updatedUser.role,
      fullName: updatedUser.fullName,
      major: updatedUser.major,
      isProfileCompleted: updatedUser.isProfileCompleted,
      year: updatedUser.year,
      createdAt: updatedUser.createdAt,
    };
  }

  // delete
  static async deleteUser(id: string): Promise<string> {
    const user = await UsersRepository.findOneBy({ id });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const result = await UsersRepository.remove(user);
    return result ? "success" : "failed";
  }
}