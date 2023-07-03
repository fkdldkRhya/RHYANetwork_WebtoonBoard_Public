import { IsNotEmpty, IsString } from "class-validator";

export class UserInfoFindIdAndPasswordQuery {
    @IsNotEmpty()
    @IsString()
    readonly userId: string

    @IsNotEmpty()
    @IsString()
    readonly password: string
}