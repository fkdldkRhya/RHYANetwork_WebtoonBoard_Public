import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { Optional } from 'src/util/dto/optional.dto';
import { ElasitcsearchIndexItemCountQuery } from './dto/elasitcsearch-index-item-count.dto';
import { ElasitcsearchIndexItemQuery } from './dto/elasticsearch-index-item.dto';
import { ElasitcsearchIndexItemCountUseWhereQuery } from './dto/elasitcsearch-index-item-count-use-where.dto';

@Controller('elasticsearch')
export class ElasticsearchController {
    constructor(
        private readonly elasticsearchService: ElasticsearchService
    ) {}

    @Get('get-info')
    async getDefaultInfo() : Promise<Optional<any>> {
        return await this.elasticsearchService.getElasticsearchInfo();
    }

    @Get('index-item-count')
    async getIndexInItemCount(@Query() elasitcsearchIndexItemCountQuery: ElasitcsearchIndexItemCountQuery) : Promise<Optional<number>> {
        return await this.elasticsearchService.getTargetIndexValueCount(elasitcsearchIndexItemCountQuery);
    }

    @Post('index-item-count-use-where')
    async getIndexInItemCountUseWhere(@Body() elasitcsearchIndexItemCountUseWhereQuery: ElasitcsearchIndexItemCountUseWhereQuery) : Promise<Optional<number>> {
        return await this.elasticsearchService.getTargetIndexValueCountUseWhere(elasitcsearchIndexItemCountUseWhereQuery);
    }

    @Post('index-item')
    async getIndexItem(@Body() elasitcsearchIndexItemQuery: ElasitcsearchIndexItemQuery) : Promise<Optional<any>> {
        return await this.elasticsearchService.getTargetIndexValue(elasitcsearchIndexItemQuery);
    }
}
