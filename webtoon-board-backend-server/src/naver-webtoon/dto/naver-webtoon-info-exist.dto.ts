import { IsInt, IsNotEmpty, Min } from "class-validator";

export class NaverWebtoonInfoExistQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly webtoonId: number;
}