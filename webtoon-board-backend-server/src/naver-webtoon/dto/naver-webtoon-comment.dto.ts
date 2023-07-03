import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";

export const NaverWebtoonCommentSearchType = {
    NEW: "NEW",
    BEST: "BEST",
} as const

export class NaverWebtoonCommentSearchQuery {
    // 웹툰 ID
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    readonly webtoonId: number;

    // 웹툰 회차
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly article: number;

    // 페이지 인덱스
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly page: number;
    
    // 검색 기준
    @IsOptional()
    @IsString()
    @MaxLength(10)
    readonly type: string;

    // 생성자
    constructor() {
        this.article ??= 1;
        this.page ??= 1;

        // Type 자동 설정 및 데이터 검증
        this.type ??= NaverWebtoonCommentSearchType.NEW;
        this.type = 
            this.type == NaverWebtoonCommentSearchType.BEST ||
            this.type == NaverWebtoonCommentSearchType.NEW ?
            this.type : NaverWebtoonCommentSearchType.NEW;
    }
}