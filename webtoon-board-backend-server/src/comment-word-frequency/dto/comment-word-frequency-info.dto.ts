import { IsEnum, IsInt, IsNotEmpty, Min } from "class-validator";
import { WebtoonProvider } from "src/webtoon-info/entities/webtoon-info.entity";

export class CommentWordFrequencyInfoQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly webtoonId: number;
    
    @IsNotEmpty()
    @IsEnum(WebtoonProvider)
    readonly webtoonProvider: WebtoonProvider
}