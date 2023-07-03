import { IsInt, IsNotEmpty, Min } from "class-validator";
import { WebtoonInfoEntity } from "src/webtoon-info/entities/webtoon-info.entity";

export class NaverWebtoonInfoEditQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly webtoonId: number;

    @IsNotEmpty()
    readonly webtoonInfo: WebtoonInfoEntity;
}