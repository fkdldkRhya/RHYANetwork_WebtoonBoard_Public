import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentWordFrequencyService } from './comment-word-frequency.service';
import { CommentWordFrequencyInfoQuery } from './dto/comment-word-frequency-info.dto';
import { CommentWordFrequencySaveQuery } from './dto/comment-word-frequency-save-query.dto';

@Controller('comment-word-frequency')
export class CommentWordFrequencyController {
    constructor(
        private readonly commentWordFrequencyService: CommentWordFrequencyService
    ) {}

    /**
     * 웹툰 댓글 빈도 정보를 가져옵니다.
     */
    @Get('get')
    async getCommentWordFrequencyInfo(@Query() commentWordFrequencyInfoQuery: CommentWordFrequencyInfoQuery) {
        return await this.commentWordFrequencyService.getCommentWordFrequencyInfo(commentWordFrequencyInfoQuery);
    }

    /**
     * 웹툰 댓글 빈도 정보를 저장합니다.
    */
    @Post('save')
    async saveCommentWordFrequencyInfo(@Body() commentWordFrequencySaveQuery: CommentWordFrequencySaveQuery) {
        return await this.commentWordFrequencyService.saveCommentWordFrequencyInfo(commentWordFrequencySaveQuery);
    }
}
