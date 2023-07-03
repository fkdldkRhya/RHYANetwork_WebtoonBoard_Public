import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { WebtoonProvider } from "src/webtoon-info/entities/webtoon-info.entity";

export class CommentWordFrequencySaveQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly webtoonId: number;
    
    @IsNotEmpty()
    @IsEnum(WebtoonProvider)
    readonly webtoonProvider: WebtoonProvider

    @IsNotEmpty()
    readonly frequency: any;
}