import { Client } from '@elastic/elasticsearch';
import { Injectable } from '@nestjs/common';
import { ErrorLogFormat, getErrorMessage } from 'src/util/dto/error-log-format.service.dto';
import { Optional, OptionalResult } from 'src/util/dto/optional.dto';
import { MyLogger } from 'src/util/logger/my-logger.service';
import { autoCloseElasticsearchClient } from './util/elasticsearch-client.util';
import { ElasitcsearchIndexItemCountQuery } from './dto/elasitcsearch-index-item-count.dto';
import { ElasitcsearchIndexItemQuery } from './dto/elasticsearch-index-item.dto';
import { ElasitcsearchIndexItemCountUseWhereQuery } from './dto/elasitcsearch-index-item-count-use-where.dto';

@Injectable()
export class ElasticsearchService {
    // -----------------------------------------
    // Logger setting
    // -----------------------------------------
    private readonly LOGGER_CONTEXT_NAME: string = ElasticsearchService.name;
    // -----------------------------------------

    constructor(
        private readonly logger: MyLogger
    ) {}

    /**
     * Elasticsearch의 정보를 가져옵니다.
     */
    async getElasticsearchInfo() : Promise<Optional<any>> {
        try {
            const data : any = await autoCloseElasticsearchClient<any>(async (client: Client) => {
                return await client.info();
            });

            return { result: OptionalResult.SUCCESS, data: data };
        }catch(error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getElasticsearchInfo.name,
                error: error,
                moreMessage: "Elasitcsearch 정보를 가져오는데 실패하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * Elasticsearch의 특정 인덱스 내부 아이템 개수 정보를 가져옵니다.
     */
    async getTargetIndexValueCount(elasitcsearchIndexItemCountQuery: ElasitcsearchIndexItemCountQuery) : Promise<Optional<number>> {
        try {
            const data : any = await autoCloseElasticsearchClient<any>(async (client: Client) => {
                return await client.count({ index: elasitcsearchIndexItemCountQuery.index });
            });

            return { result: OptionalResult.SUCCESS, data: data };
        }catch(error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getTargetIndexValueCount.name,
                input: JSON.stringify(elasitcsearchIndexItemCountQuery),
                error: error,
                moreMessage: "Elasitcsearch 인덱스 내부 아이템 개수 정보를 가져오는데 실패하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * Elasticsearch의 특정 인덱스 내부 아이템 개수 정보를 가져옵니다. (조건문 포함)
     */
    async getTargetIndexValueCountUseWhere(elasitcsearchIndexItemCountUseWhereQuery: ElasitcsearchIndexItemCountUseWhereQuery) : Promise<Optional<number>> {
        try {
            const data : any = await autoCloseElasticsearchClient<any>(async (client: Client) => {
                return await client.count({ 
                    index: elasitcsearchIndexItemCountUseWhereQuery.index,
                    query: elasitcsearchIndexItemCountUseWhereQuery.query
                });
            });

            return { result: OptionalResult.SUCCESS, data: data };
        }catch(error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getTargetIndexValueCountUseWhere.name,
                input: JSON.stringify(elasitcsearchIndexItemCountUseWhereQuery),
                error: error,
                moreMessage: "Elasitcsearch 인덱스 내부 아이템 개수 정보를 가져오는데 실패하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * Elasticsearch의 특정 인덱스 내부에 아이템을 가져옵니다.
     */
    async getTargetIndexValue(elasitcsearchIndexItemQuery: ElasitcsearchIndexItemQuery) : Promise<Optional<any>> {
        try {
            const query : any = { 
                index: elasitcsearchIndexItemQuery.index,
                body: {
                    sort: elasitcsearchIndexItemQuery.sort,
                    size: elasitcsearchIndexItemQuery.size,
                    query: elasitcsearchIndexItemQuery.query
                }
            };

            if (elasitcsearchIndexItemQuery.searchAfter)
                query["search_after"] = [ elasitcsearchIndexItemQuery.searchAfter ];

            if (elasitcsearchIndexItemQuery.aggs)
                query["body"]["aggs"] = elasitcsearchIndexItemQuery.aggs;

            const data : any = await autoCloseElasticsearchClient<any>(async (client: Client) => {
                return await client.search(query);
            });

            return { result: OptionalResult.SUCCESS, data: data };
        }catch(error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getTargetIndexValue.name,
                input: JSON.stringify(elasitcsearchIndexItemQuery),
                error: error,
                moreMessage: "Elasitcsearch 인덱스 내부 아이템 정보를 가져오는데 실패하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }
}