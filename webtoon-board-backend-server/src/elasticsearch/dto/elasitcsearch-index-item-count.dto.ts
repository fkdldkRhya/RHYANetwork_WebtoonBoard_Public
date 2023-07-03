import { IsEnum, IsNotEmpty } from "class-validator";
import { ElasitcsearchIndexName } from "../util/elasticsearch-index.util";

export class ElasitcsearchIndexItemCountQuery {
    @IsNotEmpty()
    @IsEnum(ElasitcsearchIndexName)
    readonly index: ElasitcsearchIndexName
}