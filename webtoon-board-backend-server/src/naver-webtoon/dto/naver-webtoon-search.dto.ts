import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class NaverWebtoonSearchQuery {
    // 검색어
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    readonly keyword: string;

    // 페이지 인덱스
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly page: number;

    // 생성자
    constructor() {
        this.page ??= 1;
    }
}