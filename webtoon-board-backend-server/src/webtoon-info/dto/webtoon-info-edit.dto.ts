import {  IsEnum, IsInt, IsNotEmpty, Min } from "class-validator";
import { WebtoonInfoEntity, WebtoonProvider } from "../entities/webtoon-info.entity";

export class WebtoonInfoEditQuery {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly webtoonId: number;
    
    @IsNotEmpty()
    @IsEnum(WebtoonProvider)
    readonly webtoonProvider: WebtoonProvider

    @IsNotEmpty()
    readonly webtoonInfo: WebtoonInfoEntity;
}