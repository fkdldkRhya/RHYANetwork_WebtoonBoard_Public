import { IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";
import { UserInfoEntity } from "../entities/user-info.entity";

export class UserUpdateForFrontendQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @MinLength(5)
    readonly userId: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(300)
    @MinLength(5)
    readonly token: string;

    @IsNotEmpty()
    readonly userInfo: UserInfoEntity;
}