import { IsInt, IsNotEmpty, Min } from "class-validator";

export class NaverWebtoonInfoGetFromDBQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly webtoonId: number;
}