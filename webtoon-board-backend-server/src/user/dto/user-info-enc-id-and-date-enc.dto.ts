import { IsNotEmpty, IsString } from "class-validator";

export class UserInfoEncIdAndDateEncQuery {
    @IsNotEmpty()
    @IsString()
    readonly encryptId: string;
}