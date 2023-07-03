import { IsNumber } from "class-validator";

export class WebtoonInfoRequestDeleteQuery {
    @IsNumber()
    readonly id: number;
}