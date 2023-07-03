import { Column, Entity, PrimaryColumn } from "typeorm";
import { WebtoonProvider } from "src/webtoon-info/entities/webtoon-info.entity";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

@Entity('webtoon_comment_word_frequency')
export class CommentWordFrequencyInfoEntity {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @PrimaryColumn({name: "webtoonId", nullable: false})
    webtoonId: number;

    @IsNotEmpty()
    @IsString()
    @PrimaryColumn({name: "provider", nullable: false, enum: WebtoonProvider, default: WebtoonProvider.NAVER})
    provider: WebtoonProvider;

    @IsNotEmpty()
    @IsString()
    @Column({name: "frequency", nullable: false})
    frequency: string;
}