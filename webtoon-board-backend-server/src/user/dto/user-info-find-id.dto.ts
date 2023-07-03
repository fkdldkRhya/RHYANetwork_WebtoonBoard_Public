import { IsNotEmpty, IsString } from "class-validator";

export class UserInfoFindIdQuery {
    @IsNotEmpty()
    @IsString()
    readonly userId: string;
}