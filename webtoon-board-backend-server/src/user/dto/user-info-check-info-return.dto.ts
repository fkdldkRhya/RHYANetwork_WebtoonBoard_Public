import { IsNotEmpty, IsNumber } from "class-validator";

export class UserInfoCheckInfoReturnQuery {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number
}