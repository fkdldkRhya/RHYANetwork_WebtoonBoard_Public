import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../entities/user-info.entity";

export class UserInfoAddQuery {
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @MinLength(5)
    readonly userId: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @MinLength(5)
    readonly password: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(40)
    @MinLength(2)
    readonly userName: string

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(65)
    readonly userEmail: string

    @IsOptional()
    @IsString()
    @MaxLength(200)
    readonly userDescription: string

    @IsNotEmpty()
    @IsEnum(UserRole)
    readonly userRole: UserRole
}