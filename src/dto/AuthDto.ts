import { IsNotEmpty, IsString } from "class-validator";

// login request
export class LoginRequestDTO {

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

//login response
export class LoginResponseDTO {
  token: string;   // JWT token
}


