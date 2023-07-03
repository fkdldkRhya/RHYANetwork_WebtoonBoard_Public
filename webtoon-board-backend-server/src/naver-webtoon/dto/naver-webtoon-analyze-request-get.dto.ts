import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class NaverWebtoonAnalyzeRequestGetQuery {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    readonly id : number;
}