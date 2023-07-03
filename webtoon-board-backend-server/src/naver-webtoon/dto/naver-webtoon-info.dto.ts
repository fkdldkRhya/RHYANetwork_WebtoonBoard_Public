import { IsInt, IsNotEmpty, Min } from "class-validator";

export class NaverWebtoonInfoQuery {
    // 웹툰 ID
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    readonly webtoonId: number;
}