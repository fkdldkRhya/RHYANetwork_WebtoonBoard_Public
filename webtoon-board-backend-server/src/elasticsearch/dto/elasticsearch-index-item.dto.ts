import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ElasitcsearchIndexName } from "../util/elasticsearch-index.util";

export class ElasitcsearchIndexItemQuery {
    @IsNotEmpty()
    @IsEnum(ElasitcsearchIndexName)
    readonly index: ElasitcsearchIndexName

    @IsOptional()
    @IsNumber()
    readonly searchAfter?: number = -1;
    
    @IsOptional()
    readonly sort?: any = [{"_id": "asc"}]

    @IsOptional()
    readonly query?: any = { "match_all": {} };
    
    @IsOptional()
    readonly aggs?: any;
    
    @IsOptional()
    @IsNumber()
    readonly size?: number = 10;

    @IsOptional()
    @IsBoolean()
    readonly isUseQuery?: boolean = true;
}