import { IsInt, IsNotEmpty, Min } from "class-validator";

export class UserInfoFindDefaultQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly id: number;
}