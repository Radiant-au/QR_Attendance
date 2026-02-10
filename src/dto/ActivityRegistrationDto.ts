import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterActivityReqDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    activityId: string;
}

export class CancelActivityReqDto {
    @IsString()
    @IsNotEmpty()
    cancellationReason: string;

    @IsString()
    @IsNotEmpty()
    activityId: string;
}

export interface ActivityRegistrationResponse {
    username: string;
    fullName: string;
    major: string;
    year: string;
    registeredAt: Date;
}
