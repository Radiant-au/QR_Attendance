import { IsString, IsNotEmpty, IsInt } from 'class-validator';



/**
 * Used for API responses to hide sensitive data like password
 */
export interface ShopkeeperResponseDto {
  id: string;
  username: string;
  totalScanned: number;
  shopId: string;
  shopName: string;
}

export interface scannedCoupons {
  id: string;
  code: string;
  date: string;
}

export interface ShopkeeperWithCouponsResponseDto extends ShopkeeperResponseDto {
  scannedCoupons?: scannedCoupons[];
}

// registe request
export class CreateShopkeeperDTO {

  @IsString()
  @IsNotEmpty()
  username: string;      // Login identifier (MUST be unique)

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  shopId: number;
}

//register response
export class RegisterResponseDTO {
  @IsInt()
  id: number;

  @IsString()
  username: string;
}