import { IsInt, IsNotEmpty, Min } from "class-validator";

export class NaverWebtoonRecommendListQuery {
    // 웹툰 ID
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    readonly webtoonId: number;
}