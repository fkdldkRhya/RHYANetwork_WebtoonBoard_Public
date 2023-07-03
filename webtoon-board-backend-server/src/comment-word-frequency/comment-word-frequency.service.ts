import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MyLogger } from 'src/util/logger/my-logger.service';
import { Repository } from 'typeorm';
import { CommentWordFrequencyInfoEntity } from './entities/comment-word-frequency-info.entity';
import { Optional, OptionalResult } from 'src/util/dto/optional.dto';
import { CommentWordFrequencyInfoQuery } from './dto/comment-word-frequency-info.dto';
import { ErrorLogFormat, getErrorMessage } from 'src/util/dto/error-log-format.service.dto';
import { CommentWordFrequencySaveQuery } from './dto/comment-word-frequency-save-query.dto';

@Injectable()
export class CommentWordFrequencyService {
    // -----------------------------------------
    // Logger setting
    // -----------------------------------------
    private readonly LOGGER_CONTEXT_NAME: string = CommentWordFrequencyService.name;
    // -----------------------------------------

    constructor(
        @InjectRepository(CommentWordFrequencyInfoEntity) private readonly commentWordFrequencyInfoEntityRepository: Repository<CommentWordFrequencyInfoEntity>,
        private readonly logger: MyLogger,
    ) { }

    /**
     * 웹툰 댓글 빈도 정보를 가져옵니다.
     */
    async getCommentWordFrequencyInfo(commentWordFrequencyInfoQuery: CommentWordFrequencyInfoQuery): Promise<Optional<CommentWordFrequencyInfoEntity>> {
        // 데이터 조회
        return await this.commentWordFrequencyInfoEntityRepository.findOneBy({
            webtoonId: commentWordFrequencyInfoQuery.webtoonId,
            provider: commentWordFrequencyInfoQuery.webtoonProvider
         })
         .then((response) => {
            if (!response) {
                return { result: OptionalResult.FAIL, message: "해당 정보와 일치하는 웹툰을 찾을 수 없습니다." };
            }

            return { result: OptionalResult.SUCCESS, data: response };
        })
        .catch((error) => {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.getCommentWordFrequencyInfo.name,
                    error: error,
                    input: JSON.stringify(commentWordFrequencyInfoQuery),
                    moreMessage: "웹툰 댓글 빈도 정보를 가져오는 중 오류가 발생하였습니다.",
                }
                
                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
    
                return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
            }
        );
    }

    /**
     * 웹툰 댓글 빈도 정보를 저장합니다.
    */
    async saveCommentWordFrequencyInfo(commentWordFrequencySaveQuery: CommentWordFrequencySaveQuery): Promise<Optional<CommentWordFrequencyInfoEntity>> {
        // 데이터 저장
        return await this.commentWordFrequencyInfoEntityRepository.save({
            webtoonId: commentWordFrequencySaveQuery.webtoonId,
            provider: commentWordFrequencySaveQuery.webtoonProvider,
            frequency: JSON.stringify(commentWordFrequencySaveQuery.frequency),
        })
        .then(() => {
            return { result: OptionalResult.SUCCESS };
        })
        .catch((error) => {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.saveCommentWordFrequencyInfo.name,
                    error: error,
                    input: JSON.stringify(commentWordFrequencySaveQuery),
                    moreMessage: "웹툰 댓글 빈도 정보를 저장하는 중 오류가 발생하였습니다.",
                }
                
                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
    
                return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
            }
        );
    }
}
