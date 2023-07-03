import { IsEnum, isEnum, IsInt, IsNotEmpty, Min } from "class-validator";
import { WebtoonProvider } from "src/webtoon-info/entities/webtoon-info.entity";

export class NaverWebtoonRemoveInfoQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    readonly webtoonId: number;

    // 웹툰 ID
    @IsEnum(WebtoonProvider)
    readonly webtoonProvider: WebtoonProvider;
}