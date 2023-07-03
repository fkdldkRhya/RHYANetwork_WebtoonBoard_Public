import {  IsBoolean, IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";

export class NaverWebtoonAllInfoGetFromDBQuery {
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
}