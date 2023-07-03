import { Column, Entity, PrimaryColumn } from "typeorm"

/**
 * 웹툰 정보 제공자
 */
export enum WebtoonProvider {
    NAVER = "NAVER"
}

export enum CommentTargetType {
    DATE = "DATE",
    BEST = "BEST"
}

export enum CommentMaxCountType {
    ARTICLE = "ARTICLE",
    ALL = "ALL"
}

export interface WebtoonInfoSelectWhereDTO {
    webtoonId: number;
    provider: WebtoonProvider;
}

@Entity('webtoon_info')
export class WebtoonInfoEntity {
    @PrimaryColumn({name: "webtoonId", nullable: false})
    webtoonId: number;
    
    @PrimaryColumn({name: "provider", nullable: false, enum: WebtoonProvider, default: WebtoonProvider.NAVER})
    provider: WebtoonProvider;

    @Column({name: "article_start", nullable: false})
    articleStart: number;

    @Column({name: "article_end", nullable: false})
    articleEnd: number;

    @Column({name: "comment_target", nullable: false, enum: CommentTargetType, default: CommentTargetType.DATE})
    commentTarget: CommentTargetType;

    @Column({name: "max_type", nullable: false, enum: CommentMaxCountType, default: CommentMaxCountType.ARTICLE})
    maxType: CommentMaxCountType;

    @Column({name: "max_size", nullable: false})
    maxSize: number;

    @Column({name: "is_access", nullable: false, default: 0})
    isAccess: number;
}