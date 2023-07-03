import {  IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";
import { WebtoonProvider } from "../entities/webtoon-info.entity";

export class WebtoonAllInfoQuery {
    @IsNotEmpty()
    @IsBoolean()
    readonly isUseOffset: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    readonly limit: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    readonly offset: number;

    @IsNotEmpty()
    @IsEnum(WebtoonProvider)
    readonly webtoonProvider: WebtoonProvider
}