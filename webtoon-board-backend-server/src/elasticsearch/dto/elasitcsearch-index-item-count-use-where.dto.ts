import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { ElasitcsearchIndexName } from "../util/elasticsearch-index.util";

export class ElasitcsearchIndexItemCountUseWhereQuery {
    @IsNotEmpty()
    @IsEnum(ElasitcsearchIndexName)
    readonly index: ElasitcsearchIndexName

    @IsOptional()
    readonly query?: any = { "match_all": {} };
}