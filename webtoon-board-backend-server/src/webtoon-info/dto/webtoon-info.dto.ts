import { IsEnum, IsInt, IsNotEmpty, Min } from "class-validator";
import { WebtoonProvider } from "../entities/webtoon-info.entity";

export class WebtoonInfoQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly webtoonId: number;
    
    @IsNotEmpty()
    @IsEnum(WebtoonProvider)
    readonly webtoonProvider: WebtoonProvider
}