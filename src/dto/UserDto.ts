import { IsOptional, IsString, Length } from "class-validator";

export class CreateUserRequestDto {

  @IsString({ message: "Shop name must be a string" })
  @Length(1, 100, { message: "Shop name must be between 1 and 100 characters" })
  username: string;

  @IsString({ message: "Password must be a string" })
  @Length(1, 100, { message: "Password must be between 1 and 100 characters" })
  password: string;

  @IsString({ message: "Role must be a string" })
  @Length(1, 100, { message: "Role must be between 1 and 100 characters" })
  role: string;
}


export class UpdateUserRequestDto {

  @IsOptional()
  @IsString()
  @Length(1, 100)
  fullName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 5)
  major?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  year?: string;
}

export interface UserAttendance{
  actvityName: string;
  isPresent: boolean;
  scanMethod: string;
}

export interface UserResponse {
  id: string;
  username: string;
  fullName: string;
  major: string;
  year: string;
  role: string;
  isProfileCompleted: boolean;
  createdAt: Date;
}

export interface OneUserResponse extends UserResponse{
  registrations: string[];
  attendances: UserAttendance[];
}