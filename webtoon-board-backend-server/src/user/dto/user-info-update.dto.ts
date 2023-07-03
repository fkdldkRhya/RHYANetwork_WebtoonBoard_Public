import { IsInt, IsNotEmpty, Min } from "class-validator";
import { UserInfoEntity } from "../entities/user-info.entity";

export class UserInfoUpdateQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly id: number;

    @IsNotEmpty()
    readonly userInfo: UserInfoEntity;
}