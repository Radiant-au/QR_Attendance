import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

// create activity request
export class CreateActivityDTO {

  @IsString()
  @IsNotEmpty()
  title: string;      // Login identifier (MUST be unique)

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  startDateTime: Date;

  @IsDate()
  @IsOptional()
  endDateTime?: Date;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateActivityStatusDTO {
  @IsString()
  @IsNotEmpty()
  activityId: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}

export interface ActivityResponseDTO {
  id: string;
  title: string;
  description: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  status: string;
  // capacity: number;
}