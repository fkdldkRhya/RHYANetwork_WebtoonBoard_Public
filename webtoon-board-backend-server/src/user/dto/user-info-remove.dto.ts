import { IsInt, IsNotEmpty, Min } from "class-validator";

export class UserInfoRemoveQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly id: number;
}