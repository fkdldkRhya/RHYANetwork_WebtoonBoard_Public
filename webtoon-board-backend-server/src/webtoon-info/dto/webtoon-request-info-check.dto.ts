import { IsNumber } from "class-validator";

export class WebtoonInfoRequestCheckQuery {
    @IsNumber()
    readonly id: number;
}