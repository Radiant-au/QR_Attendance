import { IsNotEmpty, IsString, IsOptional } from "class-validator";

// login request
export class LoginRequestDTO {

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// register request
export class RegisterRequestDTO {

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  role?: string;
}

//login response
export class LoginResponseDTO {
  token: string;   // JWT token
}


