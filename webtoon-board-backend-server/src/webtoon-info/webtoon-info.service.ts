import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorLogFormat, getErrorMessage } from 'src/util/dto/error-log-format.service.dto';
import { Optional, OptionalResult } from 'src/util/dto/optional.dto';
import { MyLogger } from 'src/util/logger/my-logger.service';
import { Repository } from 'typeorm';
import { WebtoonInfoEntity, WebtoonInfoSelectWhereDTO } from './entities/webtoon-info.entity';
import { WebtoonInfoQuery } from './dto/webtoon-info.dto';
import { WebtoonInfoEditQuery } from './dto/webtoon-info-edit.dto';
import { WebtoonAllInfoQuery } from './dto/webtoon-all-info.dto';
import { WebtoonAllInfoEntity } from './entities/webtoon-all-info.entity';
import { WebtoonRequestInfoEntity } from './entities/webtoon-request-info.entity';
import { WebtoonInfoRequestQuery } from './dto/webtoon-request-info.dto';
import { WebtoonInfoRequestDeleteQuery } from './dto/webtoon-request-info-delete.dto';
import { WebtoonInfoRequestCheckQuery } from './dto/webtoon-request-info-check.dto';
import { WebtoonInfoRequestGetQuery } from './dto/webtoon-request-info-get.dto';

@Injectable()
export class WebtoonInfoService {
    // -----------------------------------------
    // Logger setting
    // -----------------------------------------
    private readonly LOGGER_CONTEXT_NAME: string = WebtoonInfoService.name;
    // -----------------------------------------

    constructor(
        @InjectRepository(WebtoonRequestInfoEntity) private webtoonRequestInfoRepository: Repository<WebtoonRequestInfoEntity>,
        @InjectRepository(WebtoonInfoEntity) private webtoonInfoRepository: Repository<WebtoonInfoEntity>,
        private readonly logger: MyLogger,
    ) {}
    
    /**
     * 웹툰 정보 가져오기
     */
    async getWebtoonInfo(webtoonInfoQuery: WebtoonInfoQuery): Promise<Optional<WebtoonInfoEntity>> {
        // 데이터 추가
        return await this.webtoonInfoRepository.findOneBy({
            webtoonId: webtoonInfoQuery.webtoonId,
            provider: webtoonInfoQuery.webtoonProvider
         })
         .then(async (response) => {
            if (!response) {
                return { result: OptionalResult.FAIL, message: "해당 정보와 일치하는 웹툰을 찾을 수 없습니다." };
            }

            return { result: OptionalResult.SUCCESS, data: response };
        })
        .catch((error) => {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.getWebtoonInfo.name,
                    error: error,
                    input: JSON.stringify(webtoonInfoQuery),
                    moreMessage: "웹툰 정보를 가져오는 중 오류가 발생하였습니다.",
                }
                
                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
    
                return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
            }
        );
    }

    /**
     * 모든 웹툰 정보 가져오기
     */
    async getWebtoonAllInfo(webtoonAllInfoQuery: WebtoonAllInfoQuery): Promise<Optional<WebtoonAllInfoEntity>> {
        try {
            const queryBuilder = await this.webtoonInfoRepository.createQueryBuilder("webtoon_info");

            if (webtoonAllInfoQuery.isUseOffset) {
                queryBuilder
                .limit(webtoonAllInfoQuery.limit) 
                .offset(webtoonAllInfoQuery.offset);
            }

            return await queryBuilder.disableEscaping().getManyAndCount().then((data) => {
                const result: WebtoonAllInfoEntity = {
                    fullCount: data[1],
                    webtoonInfoEntity: data[0]
                };
                return { result: OptionalResult.SUCCESS, data: result };
            }).catch((error) => {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.getWebtoonAllInfo.name,
                    error: error,
                    input: JSON.stringify(webtoonAllInfoQuery),
                    moreMessage: "웹툰 정보를 가져오는 중 오류가 발생하였습니다.",
                }
                
                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
    
                return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
            });
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getWebtoonAllInfo.name,
                error: error,
                input: JSON.stringify(webtoonAllInfoQuery),
                moreMessage: "웹툰 정보를 가져오는 쿼리 설정 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 웹툰 정보 삽입
     */
    async addWebtoonInfo(webtoonInfoEntity: WebtoonInfoEntity): Promise<Optional<any>> {
        // 데이터 추가
        return await this.webtoonInfoRepository.save(webtoonInfoEntity).then(() => {
            return { result: OptionalResult.SUCCESS };
        }).catch(
            (error) => {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.addWebtoonInfo.name,
                    input: JSON.stringify(webtoonInfoEntity),
                    error: error,
                    moreMessage: "웹툰 정보 추가 중 오류가 발생하였습니다.",
                }
                
                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
    
                return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
            }
        );
    }

    /**
     * 웹툰 정보 존재 여부 확인
     */
    async isExistWebtoonInfo(webtoonInfoSelectWhereDTO: WebtoonInfoSelectWhereDTO): Promise<Optional<boolean>> {
        // 데이터 존제 유무 확인
        let [, count]: [WebtoonInfoEntity[], number] = await this.webtoonInfoRepository.findAndCount({
            where: {
                webtoonId: webtoonInfoSelectWhereDTO.webtoonId,
                provider: webtoonInfoSelectWhereDTO.provider
            }
        }).catch(
            (error) => {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.isExistWebtoonInfo.name,
                    input: JSON.stringify(webtoonInfoSelectWhereDTO),
                    error: error,
                    moreMessage: "웹툰 정보 존재 여부 확인 중 오류가 발생하였습니다.",
                }

                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

                return [null, 0];
            }
        );

        // 데이터 개수 비교
        if (count >= 1) {
            return { result: OptionalResult.SUCCESS , data: true };
        } else {
            return { result: OptionalResult.SUCCESS, data: false };
        }
    }

    /**
     * 웹툰 정보 수정
     */
    async editWebtoonInfo(webtoonInfoEditQuery: WebtoonInfoEditQuery): Promise<Optional<any>> {
        // 데이터 존제 유무 확인
        let [, count]: [WebtoonInfoEntity[], number] = await this.webtoonInfoRepository.findAndCount({
            where: {
                webtoonId: webtoonInfoEditQuery.webtoonId,
                provider: webtoonInfoEditQuery.webtoonProvider
            }
        });

        // 데이터 개수 비교
        if (count >= 1) {
            // 데이터 제거
            return await this.webtoonInfoRepository.update({
                webtoonId: webtoonInfoEditQuery.webtoonId,
                provider: webtoonInfoEditQuery.webtoonProvider
            },webtoonInfoEditQuery.webtoonInfo).catch((error) => {
                    let errorLogFormat : ErrorLogFormat = {
                        location: this.editWebtoonInfo.name,
                        input: JSON.stringify(webtoonInfoEditQuery),
                        error: error,
                        moreMessage: "웹툰 정보 수정 중 오류가 발생하였습니다.",
                    }
                    
                    this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
        
                    return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
                }
            ).then(() => {
                return { result: OptionalResult.SUCCESS };
            });
        }else {
            return { result: OptionalResult.FAIL, message: "입력한 웹툰 정보를 찾을 수 없어 수정할 수 없습니다." };
        }
    }

    /**
     * 웹툰 정보 제거
     */
    async removeWebtoonInfo(webtoonInfoSelectWhereDTO: WebtoonInfoSelectWhereDTO): Promise<Optional<any>> {
        // 데이터 존제 유무 확인
        let [webtoonInfoEntity, count]: [WebtoonInfoEntity[], number] = await this.webtoonInfoRepository.findAndCount({
            where: {
                webtoonId: webtoonInfoSelectWhereDTO.webtoonId,
                provider: webtoonInfoSelectWhereDTO.provider
            }
        });

        // 데이터 개수 비교
        if (count >= 1) {
            // 데이터 제거
            return await this.webtoonInfoRepository.delete({
                webtoonId: webtoonInfoSelectWhereDTO.webtoonId,
                provider: webtoonInfoSelectWhereDTO.provider,
            }).then(() => {
                    return { result: OptionalResult.SUCCESS };
            }).catch((error) => {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.removeWebtoonInfo.name,
                    input: JSON.stringify(webtoonInfoSelectWhereDTO),
                    error: error,
                    moreMessage: "웹툰 정보 제거 중 오류가 발생하였습니다.",
                }
                
                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
    
                return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
            });
        }else {
            return { result: OptionalResult.FAIL, message: "입력한 웹툰 정보를 찾을 수 없어 제거할 수 없습니다." };
        }
    }

    /**
     * 웹툰 분석 요청 데이터 저장
     */
    async getWebtoonAnalyzeRequest(webtoonInfoRequestGetQuery: WebtoonInfoRequestGetQuery): Promise<Optional<WebtoonRequestInfoEntity>> {
        // 데이터 추가
        return await this.webtoonRequestInfoRepository.findOneBy({requestUserId: webtoonInfoRequestGetQuery.id})
        .then((result: WebtoonRequestInfoEntity) => {
            if (!result) {
                return { result: OptionalResult.FAIL, message: "해당 요청 데이터를 찾을 수 없습니다." };
            }

            return { result: OptionalResult.SUCCESS, data: result };
        }).catch(
            (error) => {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.getWebtoonAnalyzeRequest.name,
                    input: JSON.stringify(webtoonInfoRequestGetQuery),
                    error: error,
                    moreMessage: "웹툰 분석 요청 데이터 불러오는 중 오류가 발생하였습니다.",
                }
                
                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

                return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
            }
        );
    }


    /**
     * 웹툰 분석 요청 데이터 신청한 정보 모두 불러오기
     */
    async getAllWebtoonAnalyzeRequest(): Promise<Optional<any>> {
        // 데이터 존제 유무 확인
        return await this.webtoonRequestInfoRepository.find()
        .then((result : WebtoonRequestInfoEntity[]) => {
            return { result: OptionalResult.SUCCESS , data: result };
        }).catch((error) => {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getAllWebtoonAnalyzeRequest.name,
                error: error,
                moreMessage: "웹툰 분석 요청 모든 데이터 불러오는 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        });
    }

    /**
     * 웹툰 분석 요청 데이터 저장
     */
    async addWebtoonAnalyzeRequest(webtoonInfoRequestQuery: WebtoonInfoRequestQuery): Promise<Optional<any>> {
        // 데이터 추가
        return await this.webtoonRequestInfoRepository.save(webtoonInfoRequestQuery.webtoonInfo)
        .then(() => {
            return { result: OptionalResult.SUCCESS };
        }).catch(
            (error) => {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.addWebtoonAnalyzeRequest.name,
                    input: JSON.stringify(webtoonInfoRequestQuery),
                    error: error,
                    moreMessage: "웹툰 분석 요청 데이터 저장 중 오류가 발생하였습니다.",
                }
                
                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
    
                return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
            }
        );
    }

    /**
     * 웹툰 분석 요청 데이터 제거
     */
    async removeWebtoonAnalyzeRequest(webtoonInfoRequestDeleteQuery: WebtoonInfoRequestDeleteQuery): Promise<Optional<any>> {
        try {
            const isExist = await this.checkWebtoonAnalyzeRequest({id: webtoonInfoRequestDeleteQuery.id})
            if (isExist.result === OptionalResult.FAIL || !isExist.data) {
                return { result: OptionalResult.FAIL, message: "해당 요청 데이터를 찾을 수 없습니다." };
            }
    
            // 데이터 제거
            return await this.webtoonRequestInfoRepository.delete({
                requestUserId: webtoonInfoRequestDeleteQuery.id
            }).then(() => {
                return { result: OptionalResult.SUCCESS };
            }).catch((error) => {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.removeWebtoonAnalyzeRequest.name,
                    input: JSON.stringify(webtoonInfoRequestDeleteQuery),
                    error: error,
                    moreMessage: "웹툰 분석 요청 데이터 제거 중 오류가 발생하였습니다.",
                }
                
                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
    
                return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
            });
        }catch(error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.removeWebtoonAnalyzeRequest.name,
                input: JSON.stringify(webtoonInfoRequestDeleteQuery),
                error: error,
                moreMessage: "웹툰 분석 요청 데이터 제거 작업 수행 과정에서 알 수 없는 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 웹툰 분석 요청 데이터 확인
     */
    async checkWebtoonAnalyzeRequest(webtoonInfoRequestCheckQuery: WebtoonInfoRequestCheckQuery): Promise<Optional<any>> {
        // 데이터 존제 유무 확인
        return await this.webtoonRequestInfoRepository.findAndCount({
            where: {
                requestUserId: webtoonInfoRequestCheckQuery.id
            }
        }).then(([,count] : [WebtoonRequestInfoEntity[], number]) => {
            if (count >= 1) {
                return { result: OptionalResult.SUCCESS , data: true };
            } else {
                return { result: OptionalResult.SUCCESS, data: false };
            }
        }).catch((error) => {
            let errorLogFormat : ErrorLogFormat = {
                location: this.checkWebtoonAnalyzeRequest.name,
                input: JSON.stringify(webtoonInfoRequestCheckQuery),
                error: error,
                moreMessage: "웹툰 분석 요청 데이터 확인 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        });
    }
}
