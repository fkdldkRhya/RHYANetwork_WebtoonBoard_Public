import { IsNotEmpty } from "class-validator";
import { WebtoonRequestInfoEntity } from "../entities/webtoon-request-info.entity";

export class WebtoonInfoRequestQuery {
    @IsNotEmpty()
    readonly webtoonInfo: WebtoonRequestInfoEntity;
}