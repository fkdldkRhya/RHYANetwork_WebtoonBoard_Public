import { IsNumber } from "class-validator";

export class WebtoonInfoRequestGetQuery {
    @IsNumber()
    readonly id: number;
}