import { IsEnum, IsInt, IsNotEmpty, Max, Min } from "class-validator";
import { CommentMaxCountType, CommentTargetType } from "src/webtoon-info/entities/webtoon-info.entity";

export class NaverWebtoonAddInfoQuery {
    // 웹툰 ID
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    readonly webtoonId: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly articleStart: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly articleEnd: number;

    @IsNotEmpty()
    @IsEnum(CommentTargetType)
    readonly commentTargetType: CommentTargetType;
    
    @IsNotEmpty()
    @IsEnum(CommentMaxCountType)
    readonly commentMaxCountType: CommentMaxCountType;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly maxSize: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(1)
    readonly isAccess: number;
}