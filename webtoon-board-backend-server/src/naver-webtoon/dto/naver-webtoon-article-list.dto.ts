import { IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";

export class NaverWebtoonArticleListQuery {
    // 웹툰 ID
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    readonly webtoonId: number;
    
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