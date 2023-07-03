import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UserUpdatePasswordForFrontendQuery {
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @MinLength(5)
    readonly userId: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @MinLength(5)
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @MinLength(5)
    readonly newPassword: string;
}