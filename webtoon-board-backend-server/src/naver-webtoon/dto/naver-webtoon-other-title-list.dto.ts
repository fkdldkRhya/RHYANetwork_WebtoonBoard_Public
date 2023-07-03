import { IsInt, IsNotEmpty, Min } from "class-validator";

export class NaverWebtoonOtherTitleListQuery {
    // 웹툰 ID
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    readonly webtoonId: number;
}