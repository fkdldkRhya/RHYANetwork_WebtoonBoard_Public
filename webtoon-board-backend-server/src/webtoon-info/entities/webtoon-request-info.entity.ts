import { Column, Entity, PrimaryColumn } from "typeorm"
import { CommentMaxCountType, CommentTargetType, WebtoonProvider } from "./webtoon-info.entity";

@Entity('webtoon_analyze_request')
export class WebtoonRequestInfoEntity {
    @PrimaryColumn({name: "request_user_id", nullable: false})
    requestUserId: number;

    @Column({name: "webtoon_id", nullable: false})
    webtoonId: number;
    
    @Column({name: "webtoon_provider", nullable: false, enum: WebtoonProvider, default: WebtoonProvider.NAVER})
    provider: WebtoonProvider;

    @Column({name: "webtoon_start_point", nullable: false})
    articleStart: number;

    @Column({name: "webtoon_end_point", nullable: false})
    articleEnd: number;

    @Column({name: "comment_target", nullable: false, enum: CommentTargetType, default: CommentTargetType.DATE})
    commentTarget: CommentTargetType;

    @Column({name: "max_type", nullable: false, enum: CommentMaxCountType, default: CommentMaxCountType.ARTICLE})
    maxType: CommentMaxCountType;

    @Column({name: "max_size", nullable: false})
    maxSize: number;
}