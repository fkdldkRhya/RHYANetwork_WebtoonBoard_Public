import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Optional, OptionalResult } from 'src/util/dto/optional.dto';
import { NaverWebtoonAddInfoQuery } from './dto/naver-webtoon-add-info.dto';
import { NaverWebtoonArticleListQuery } from './dto/naver-webtoon-article-list.dto';
import { NaverWebtoonCommentSearchQuery } from './dto/naver-webtoon-comment.dto';
import { NaverWebtoonInfoQuery } from './dto/naver-webtoon-info.dto';
import { NaverWebtoonOtherTitleListQuery } from './dto/naver-webtoon-other-title-list.dto';
import { NaverWebtoonRecommendListQuery } from './dto/naver-webtoon-recommend-list.dto';
import { NaverWebtoonRemoveInfoQuery } from './dto/naver-webtoon-remove-info.dto';
import { NaverWebtoonSearchQuery } from './dto/naver-webtoon-search.dto';
import { NaverWebtoonService } from './naver-webtoon.service';
import { NaverWebtoonInfoGetFromDBQuery } from './dto/naver-webtoon-info-from-db.dto';
import { WebtoonInfoEntity } from 'src/webtoon-info/entities/webtoon-info.entity';
import { NaverWebtoonInfoEditQuery } from './dto/naver-webtoon-edit-info.dto';
import { NaverWebtoonAllInfoGetFromDBQuery } from './dto/naver-webtoon-all-info-from-db.dto';
import { NaverWebtoonInfoExistQuery } from './dto/naver-webtoon-info-exist.dto';
import { NaverWebtoonAnalyzeRequestAddQuery } from './dto/naver-webtoon-analyze-request-add.dto';
import { NaverWebtoonAnalyzeRequestRemoveForAdminQuery, NaverWebtoonAnalyzeRequestRemoveQuery } from './dto/naver-webtoon-analyze-request-remove.dto';
import { NaverWebtoonAnalyzeRequestCheckQuery } from './dto/naver-webtoon-analyze-request-check.dto';
import { NaverWebtoonAnalyzeRequestGetQuery } from './dto/naver-webtoon-analyze-request-get.dto';
import { WebtoonRequestInfoEntity } from 'src/webtoon-info/entities/webtoon-request-info.entity';

@Controller('naver-webtoon')
export class NaverWebtoonController {
    constructor(
        private readonly naverWebtoonService: NaverWebtoonService
    ) {}

    /**
     * 네이버 웹툰 검색
     */
    @Get('search')
    async getNaverWebtoonSearch(@Query() naverWebtoonSearchQuery: NaverWebtoonSearchQuery) : Promise<Optional<string>>
    {
        const result : Optional<string> = await this.naverWebtoonService.getNaverWebtoonSearchResult(naverWebtoonSearchQuery);
        return result;
    }

    /**
     * 네이버 웹툰 간단 검색
     */
    @Get('simple-search')
    async getNaverWebtoonSimpleSearch(@Query() naverWebtoonSearchQuery: NaverWebtoonSearchQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.getNaverWebtoonSearchResult(naverWebtoonSearchQuery);

        if (result.result == OptionalResult.SUCCESS) {
            let target : any = result.data;

            // 데이터 제거
            target.searchList.forEach(element => {
                delete element.webtoonLevelCode;
                delete element.displayAuthor;
                delete element.author;
                delete element.synopsis;
                delete element.finished;
                delete element.finished;
                delete element.adult;
                delete element.nineteen;
                delete element.bm;
                delete element.up;
                delete element.rest;
                delete element.webtoonLevelUp;
                delete element.bestChallengeLevelUp;
                delete element.potenUp;
                delete element.publishDescription;
                delete element.lastArticleServiceDate;
                delete element.tagList;
                delete element.genreList;
                delete element.new;
            });
        }

        return result;
    }

    /**
     * 네이버 웹툰 코멘트(댓글) 출력
     */
    @Get('comment')
    async getNaverWebtoonCommentSearch(@Query() naverWebtoonCommentSearchQuery: NaverWebtoonCommentSearchQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.getNaverWebtoonComment(naverWebtoonCommentSearchQuery);
        return result;
    }

    /**
     * 네이버 웹툰 정보 출력
     */
    @Get('info')
    async getNaverWebtoonInfo(@Query() naverWebtoonInfoQuery: NaverWebtoonInfoQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.getNaverWebtoonInfo(naverWebtoonInfoQuery);
        return result;
    }

    /**
     * 네이버 웹툰 회차 리스트 정보 출력
     */
    @Get('article')
    async getNaverWebtoonArticleList(@Query() naverWebtoonArticleListQuery: NaverWebtoonArticleListQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.getNaverWebtoonArticleList(naverWebtoonArticleListQuery);
        return result;
    }

    /**
     * 네이버 웹툰 작가의 다른 작품 정보 출력
     */
    @Get('other-title')
    async getNaverWebtoonOtherTitleList(@Query() naverWebtoonOtherTitleListQuery: NaverWebtoonOtherTitleListQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.getNaverWebtoonOtherTitleList(naverWebtoonOtherTitleListQuery);
        return result;
    }

    /**
     * 네이버 웹툰 작품 독자들이 많이 본 웹툰 정보 출력
     */
    @Get('recommend')
    async getNaverWebtoonRecommendList(@Query() naverWebtoonRecommendListQuery: NaverWebtoonRecommendListQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.getNaverWebtoonRecommendList(naverWebtoonRecommendListQuery);
        return result;
    }

    /**
     * 네이버 웹툰 데이터 가져오기
     */
    @Get('get-db')
    async getNaverWebtoonInfoFromDB(@Query() naverWebtoonInfoGetFromDBQuery: NaverWebtoonInfoGetFromDBQuery) : Promise<Optional<WebtoonInfoEntity>>
    {
        const result : Optional<WebtoonInfoEntity> = await this.naverWebtoonService.getNaverWebtoonInfoFromDB(naverWebtoonInfoGetFromDBQuery);
        return result;
    }

    /**
     * 네이버 웹툰 데이터 가져오기
     */
    @Get('get-all-db')
    async getNaverWebtoonAllInfoFromDB(@Query() naverWebtoonAllInfoGetFromDBQuery: NaverWebtoonAllInfoGetFromDBQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.getAllNaverWebtoonInfoFromDB(naverWebtoonAllInfoGetFromDBQuery);
        return result;
    }

    /**
     * 네이버 웹툰 오늘의 인기 웹툰 정보 출력
     */
    @Get('daliy')
    async getNaverWebtoonDailyTop() : Promise<Optional<any>>
    {
        const result : Optional<WebtoonInfoEntity> = await this.naverWebtoonService.getNaverWebtoonDailyTop();
        return result;
    }

    /**
     * 네이버 웹툰 데이터 삽입
     */
    @Get('add')
    async addNaverWebtoonInfo(@Query() naverWebtoonAddInfoQuery: NaverWebtoonAddInfoQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.addNaverWebtoonInfo(naverWebtoonAddInfoQuery);
        return result;
    }

    /**
     * 네이버 웹툰 데이터 수정
     */
    @Post('edit')
    async updateNaverWebtoonInfo(@Body() naverWebtoonInfoEditQuery: NaverWebtoonInfoEditQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.editNaverWebtoonInfo(naverWebtoonInfoEditQuery);
        return result;
    }

    /**
     * 네이버 웹툰 데이터 제거
     */
    @Get('remove')
    async removeNaverWebtoonInfo(@Query() naverWebtoonRemoveInfoQuery: NaverWebtoonRemoveInfoQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.removeNaverWebtoonInfo(naverWebtoonRemoveInfoQuery);
        return result;
    }

    /**
     * 네이버 웹툰 데이터 존재 여부 확인
     */
    @Get('exist')
    async existNaverWebtoonInfo(@Query() naverWebtoonInfoExistQuery: NaverWebtoonInfoExistQuery) : Promise<Optional<boolean>>
    {
        const result : Optional<any> = await this.naverWebtoonService.isExistNaverWebtoonInfo(naverWebtoonInfoExistQuery);
        return result;
    }

    /**
     * 네이버 웹툰 분석 요청 데이터 불러오기
     */
    @Get('anlayze-request-get')
    async getNaverWebtoonAnalyzeRequestInfo(@Query() naverWebtoonAnalyzeRequestGetQuery : NaverWebtoonAnalyzeRequestGetQuery) : Promise<Optional<WebtoonRequestInfoEntity>>
    {
        const result : Optional<WebtoonRequestInfoEntity> = await this.naverWebtoonService.getRequestNaverWebtoonAnalysis(naverWebtoonAnalyzeRequestGetQuery);
        return result;
    }

    /**
     * 네이버 웹툰 분석 요청 데이터 불러오기
     */
    @Get('anlayze-request-get-all')
    async getAllNaverWebtoonAnalyzeRequestInfo() : Promise<Optional<WebtoonRequestInfoEntity>>
    {
        const result : Optional<WebtoonRequestInfoEntity> = await this.naverWebtoonService.getAllRequestNaverWebtoonAnalysis();
        return result;
    }

    /**
     * 네이버 웹툰 분석 요청 데이터 삽입
     */
    @Post('anlayze-request-add')
    async addNaverWebtoonAnalyzeRequestInfo(@Body() naverWebtoonAnalyzeRequestAddQuery : NaverWebtoonAnalyzeRequestAddQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.addRequestNaverWebtoonAnalysis(naverWebtoonAnalyzeRequestAddQuery);
        return result;
    }

    /**
     * 네이버 웹툰 분석 요청 데이터 제거
     */
    @Post('anlayze-request-remove')
    async removeNaverWebtoonAnalyzeRequestInfo(@Body() naverWebtoonAnalyzeRequestRemoveQuery : NaverWebtoonAnalyzeRequestRemoveQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.removeRequestNaverWebtoonAnalysis(naverWebtoonAnalyzeRequestRemoveQuery);
        return result;
    }

    /**
     * 네이버 웹툰 분석 요청 데이터 제거
     */
    @Get('anlayze-request-remove-for-admin')
    async removeNaverWebtoonAnalyzeRequestInfoForAdmin(@Query() naverWebtoonAnalyzeRequestRemoveForAdminQuery : NaverWebtoonAnalyzeRequestRemoveForAdminQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.removeRequestNaverWebtoonAnalysisForAdmin(naverWebtoonAnalyzeRequestRemoveForAdminQuery);
        return result;
    }

    /**
     * 네이버 웹툰 분석 요청 데이터 확인
     */
    @Post('anlayze-request-check')
    async checkNaverWebtoonAnalyzeRequestInfo(@Body() naverWebtoonAnalyzeRequestCheckQuery : NaverWebtoonAnalyzeRequestCheckQuery) : Promise<Optional<any>>
    {
        const result : Optional<any> = await this.naverWebtoonService.checkRequestNaverWebtoonAnalysis(naverWebtoonAnalyzeRequestCheckQuery);
        return result;
    }
}
