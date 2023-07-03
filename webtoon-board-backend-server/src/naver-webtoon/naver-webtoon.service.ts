import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ErrorLogFormat, getErrorMessage } from 'src/util/dto/error-log-format.service.dto';
import { Optional, OptionalResult } from 'src/util/dto/optional.dto';
import { NaverWebtoonArticleListQuery } from './dto/naver-webtoon-article-list.dto';
import { NaverWebtoonCommentSearchQuery } from './dto/naver-webtoon-comment.dto';
import { NaverWebtoonInfoQuery } from './dto/naver-webtoon-info.dto';
import { NaverWebtoonOtherTitleListQuery } from './dto/naver-webtoon-other-title-list.dto';
import { NaverWebtoonRecommendListQuery } from './dto/naver-webtoon-recommend-list.dto';
import { NaverWebtoonSearchQuery } from './dto/naver-webtoon-search.dto';
import { MyLogger } from '../util/logger/my-logger.service';
import { WebtoonInfoService } from 'src/webtoon-info/webtoon-info.service';
import { NaverWebtoonAddInfoQuery } from './dto/naver-webtoon-add-info.dto';
import { WebtoonInfoEntity, WebtoonProvider } from 'src/webtoon-info/entities/webtoon-info.entity';
import { NaverWebtoonRemoveInfoQuery } from './dto/naver-webtoon-remove-info.dto';
import { NaverWebtoonInfoGetFromDBQuery } from './dto/naver-webtoon-info-from-db.dto';
import { NaverWebtoonInfoEditQuery } from './dto/naver-webtoon-edit-info.dto';
import { NaverWebtoonAllInfoGetFromDBQuery } from './dto/naver-webtoon-all-info-from-db.dto';
import { WebtoonAllInfoEntity } from 'src/webtoon-info/entities/webtoon-all-info.entity';
import { NaverWebtoonInfoExistQuery } from './dto/naver-webtoon-info-exist.dto';
import { UserService } from 'src/user/user.service';
import { NaverWebtoonAnalyzeRequestAddQuery } from './dto/naver-webtoon-analyze-request-add.dto';
import { NaverWebtoonAnalyzeRequestRemoveForAdminQuery, NaverWebtoonAnalyzeRequestRemoveQuery } from './dto/naver-webtoon-analyze-request-remove.dto';
import { NaverWebtoonAnalyzeRequestCheckQuery } from './dto/naver-webtoon-analyze-request-check.dto';
import { NaverWebtoonAnalyzeRequestGetQuery } from './dto/naver-webtoon-analyze-request-get.dto';
import { WebtoonRequestInfoEntity } from 'src/webtoon-info/entities/webtoon-request-info.entity';
@Injectable()
export class NaverWebtoonService {
    // -----------------------------------------
    // Logger setting
    // -----------------------------------------
    private readonly LOGGER_CONTEXT_NAME: string = NaverWebtoonService.name;
    // -----------------------------------------

    constructor(
        private readonly userService: UserService,
        private readonly webtoonInfoService: WebtoonInfoService,
        private readonly httpService: HttpService,
        private readonly logger: MyLogger
    ) {}

    /**
     * 네이버 웹툰 검색 API
     */
    async getNaverWebtoonSearchResult(naverWebtoonSearchQuery: NaverWebtoonSearchQuery) : Promise<Optional<string>> {
        let result : Optional<string> = { result: OptionalResult.FAIL }
        try {
            let response : AxiosResponse<any, any> = await this.httpService.axiosRef({
                url: `https://comic.naver.com/api/search/webtoon?keyword=${naverWebtoonSearchQuery.keyword}&page=${naverWebtoonSearchQuery.page}`,
                method: 'GET',
                responseType: 'json',
            });

            // API 결과 확인
            if (response.status == 200) {
                if (response.data != undefined && response.data != null) {
                    result.result = OptionalResult.SUCCESS;
                    result.data = response.data;
                }else {
                    result.result = OptionalResult.FAIL;
                }
            }else { // 오류 출력
                result.result = OptionalResult.FAIL;
                result.message = "네이버 웹툰 검색 API의 HTTP 응답이 200(OK)이 아닙니다.";
            }

            return result;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getNaverWebtoonSearchResult.name,
                error: error,
                input: JSON.stringify(naverWebtoonSearchQuery),
                moreMessage: "네이버 웹툰 검색 API를 통해 검색 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 댓글 출력 API
     */
    async getNaverWebtoonComment(naverWebtoonCommentSearchQuery: NaverWebtoonCommentSearchQuery) : Promise<Optional<any>> {
        let result : Optional<any> = { result: OptionalResult.FAIL }

        try {
            let response: AxiosResponse<any, any> = await this.httpService.axiosRef({
                url: `https://apis.naver.com/commentBox/cbox/web_naver_list_jsonp.json?ticket=comic&templateId=webtoon&pool=cbox3&lang=ko&country=KR&objectId=${naverWebtoonCommentSearchQuery.webtoonId}_${naverWebtoonCommentSearchQuery.article}&listType=OBJECT&sort=${naverWebtoonCommentSearchQuery.type}&page=${naverWebtoonCommentSearchQuery.page}`,
                method: 'GET',
                responseType: 'json',
                headers: {
                    'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
                    'accept' : "*/*",
                    'accept-encoding' : 'gzip, deflate, br',
                    'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                    'referer': 'https://comic.naver.com/'
                }
            });

            // API 결과 확인
            if (response.status == 200) {
                if (response.data != undefined && response.data != null) {
                    result.result = OptionalResult.SUCCESS;
                    result.data = JSON.parse(response.data.substring("_callback(".length, response.data.length - 2));
                }else {
                    result.result = OptionalResult.FAIL;
                }
            }else { // 오류 출력
                result.result = OptionalResult.FAIL;
                result.message = "네이버 웹툰 코멘트(댓글) 검색 API의 HTTP 응답이 200(OK)이 아닙니다.";
            }

            return result;
        }catch(error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getNaverWebtoonComment.name,
                error: error,
                input: JSON.stringify(naverWebtoonCommentSearchQuery),
                moreMessage: "네이버 웹툰 코멘트(댓글) API를 통해 검색 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 정보 출력 API
     */
    async getNaverWebtoonInfo(naverWebtoonInfoQuery: NaverWebtoonInfoQuery) : Promise<Optional<any>> {
        let result : Optional<string> = { result: OptionalResult.FAIL }

        try {
            let response : AxiosResponse<any, any> = await this.httpService.axiosRef({
                url: `https://comic.naver.com/api/article/list/info?titleId=${naverWebtoonInfoQuery.webtoonId}`,
                method: 'GET',
                responseType: 'json',
            });

            // API 결과 확인
            if (response.status == 200) {
                if (response.data != undefined && response.data != null) {
                    result.result = OptionalResult.SUCCESS;
                    result.data = response.data;
                }else {
                    result.result = OptionalResult.FAIL;
                }
            }else { // 오류 출력
                result.result = OptionalResult.FAIL;
                result.message = "네이버 웹툰 데이터 API의 HTTP 응답이 200(OK)이 아닙니다.";
            }

            return result;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getNaverWebtoonInfo.name,
                error: error,
                input: JSON.stringify(naverWebtoonInfoQuery),
                moreMessage: "네이버 웹툰 데이터 API를 통해 검색 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 회차 정보 출력 API
     */
    async getNaverWebtoonArticleList(naverWebtoonArticleListQuery: NaverWebtoonArticleListQuery) : Promise<Optional<any>> {
        let result : Optional<string> = { result: OptionalResult.FAIL }

        try {
            let response : AxiosResponse<any, any> = await this.httpService.axiosRef({
                url: `https://comic.naver.com/api/article/list?titleId=${naverWebtoonArticleListQuery.webtoonId}&page=${naverWebtoonArticleListQuery.page}`,
                method: 'GET',
                responseType: 'json',
            });

            // API 결과 확인
            if (response.status == 200) {
                if (response.data != undefined && response.data != null) {
                    result.result = OptionalResult.SUCCESS;
                    result.data = response.data;
                }else {
                    result.result = OptionalResult.FAIL;
                }
            }else { // 오류 출력
                result.result = OptionalResult.FAIL;
                result.message = "네이버 웹툰 데이터(회차 정보) API의 HTTP 응답이 200(OK)이 아닙니다.";
            }

            return result;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getNaverWebtoonArticleList.name,
                error: error,
                input: JSON.stringify(naverWebtoonArticleListQuery),
                moreMessage: "네이버 웹툰 데이터(회차 정보) API를 통해 검색 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 작가의 다른 작품 정보 출력 API
     */
    async getNaverWebtoonOtherTitleList(naverWebtoonOtherTitleListQuery: NaverWebtoonOtherTitleListQuery) : Promise<Optional<any>> {
        let result : Optional<string> = { result: OptionalResult.FAIL }

        try {
            let response : AxiosResponse<any, any> = await this.httpService.axiosRef({
                url: `https://comic.naver.com/api/artist/otherTitle/list?titleId=${naverWebtoonOtherTitleListQuery.webtoonId}`,
                method: 'GET',
                responseType: 'json',
            });

            // API 결과 확인
            if (response.status == 200) {
                if (response.data != undefined && response.data != null) {
                    result.result = OptionalResult.SUCCESS;
                    result.data = response.data;
                }else {
                    result.result = OptionalResult.FAIL;
                }
            }else { // 오류 출력
                result.result = OptionalResult.FAIL;
                result.message = "네이버 웹툰 데이터(작가의 다른 작품 정보) API의 HTTP 응답이 200(OK)이 아닙니다.";
            }

            return result;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getNaverWebtoonOtherTitleList.name,
                error: error,
                input: JSON.stringify(naverWebtoonOtherTitleListQuery),
                moreMessage: "네이버 웹툰 데이터(작가의 다른 작품 정보) API를 통해 검색 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 작품 독자들이 많이 본 웹툰 정보 출력 API
     */
    async getNaverWebtoonRecommendList(naverWebtoonRecommendListQuery: NaverWebtoonRecommendListQuery) : Promise<Optional<any>> {
        let result : Optional<string> = { result: OptionalResult.FAIL }

        try {
            let response : AxiosResponse<any, any> = await this.httpService.axiosRef({
                url: `https://comic.naver.com/api/recommend/list?titleId=${naverWebtoonRecommendListQuery.webtoonId}`,
                method: 'GET',
                responseType: 'json',
            });

            // API 결과 확인
            if (response.status == 200) {
                if (response.data != undefined && response.data != null) {
                    result.result = OptionalResult.SUCCESS;
                    result.data = response.data;
                }else {
                    result.result = OptionalResult.FAIL;
                }
            }else { // 오류 출력
                result.result = OptionalResult.FAIL;
                result.message = "네이버 웹툰 데이터(작품 독자들이 많이 본 웹툰 정보) API의 HTTP 응답이 200(OK)이 아닙니다.";
            }

            return result;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getNaverWebtoonOtherTitleList.name,
                error: error,
                input: JSON.stringify(naverWebtoonRecommendListQuery),
                moreMessage: "네이버 웹툰 데이터(작품 독자들이 많이 본 웹툰 정보) API를 통해 검색 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 오늘의 인기 웹툰 정보 출력 API
     */
    async getNaverWebtoonDailyTop() : Promise<Optional<any>> {
        let result : Optional<string> = { result: OptionalResult.FAIL }

        try {
            let response : AxiosResponse<any, any> = await this.httpService.axiosRef({
                url: `https://comic.naver.com/api/home/component?type=DAILY_WEBTOON&order=`,
                method: 'GET',
                responseType: 'json',
            });

            // API 결과 확인
            if (response.status == 200) {
                if (response.data != undefined && response.data != null) {
                    result.result = OptionalResult.SUCCESS;
                    result.data = response.data;
                }else {
                    result.result = OptionalResult.FAIL;
                }
            }else { // 오류 출력
                result.result = OptionalResult.FAIL;
                result.message = "네이버 웹툰 오늘의 인기 웹툰 정보 출력 API의 HTTP 응답이 200(OK)이 아닙니다.";
            }

            return result;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getNaverWebtoonDailyTop.name,
                error: error,
                moreMessage: "네이버 웹툰 오늘의 인기 웹툰 정보 출력 API를 통해 검색 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 데이터 가져오기
     */
    async getNaverWebtoonInfoFromDB(naverWebtoonInfoGetFromDBQuery: NaverWebtoonInfoGetFromDBQuery): Promise<Optional<WebtoonInfoEntity>> {
        try {
            return await this.webtoonInfoService.getWebtoonInfo({
                webtoonId: naverWebtoonInfoGetFromDBQuery.webtoonId,
                webtoonProvider: WebtoonProvider.NAVER
            });
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getNaverWebtoonInfoFromDB.name,
                error: error,
                input: JSON.stringify(naverWebtoonInfoGetFromDBQuery),
                moreMessage: "네이버 웹툰 데이터를 데이터베이스에서 가져오는 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 모든 네이버 웹툰 데이터 가져오기
     */
    async getAllNaverWebtoonInfoFromDB(naverWebtoonAllInfoGetFromDBQuery: NaverWebtoonAllInfoGetFromDBQuery): Promise<Optional<any>> {
        try {
            let defaultInfo : Optional<WebtoonAllInfoEntity> = await this.webtoonInfoService.getWebtoonAllInfo({
                webtoonProvider: WebtoonProvider.NAVER,
                isUseOffset: naverWebtoonAllInfoGetFromDBQuery.isUseOffset,
                offset: naverWebtoonAllInfoGetFromDBQuery.offset,
                limit: naverWebtoonAllInfoGetFromDBQuery.limit,
            });

            let containDetailInfoArray : Array<any> = new Array<any>();

            // 세부 정보 가져오기
            for (let i = 0; i < defaultInfo.data.webtoonInfoEntity.length; i ++) {
                const element : WebtoonInfoEntity = defaultInfo.data.webtoonInfoEntity.at(i);
                const webtoonDetailInfo : Optional<any> = await this.getNaverWebtoonInfo({webtoonId: element.webtoonId});
                let createObj : {} = element as {};
                if (webtoonDetailInfo.result == OptionalResult.SUCCESS && webtoonDetailInfo.data) {
                    createObj["title"] = webtoonDetailInfo.data.titleName;
                    createObj["synopsis"] = webtoonDetailInfo.data.synopsis;
                }else {
                    createObj["title"] = null;
                    createObj["synopsis"] = null;
                }

                containDetailInfoArray.push(createObj);
            }

            return { result: OptionalResult.SUCCESS, data: { "fullCount": defaultInfo.data.fullCount, "array": containDetailInfoArray } };
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getNaverWebtoonInfoFromDB.name,
                error: error,
                input: JSON.stringify(naverWebtoonAllInfoGetFromDBQuery),
                moreMessage: "네이버 웹툰 데이터를 데이터베이스에서 가져오는 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 데이터 삽입
     */
    async addNaverWebtoonInfo(naverWebtoonAddInfoQuery: NaverWebtoonAddInfoQuery): Promise<Optional<any>> {
        let result : Optional<string> = { result: OptionalResult.FAIL }

        try {
            let webtoonInfo: Optional<any> = await this.getNaverWebtoonInfo({webtoonId: naverWebtoonAddInfoQuery.webtoonId});

            if (webtoonInfo.result == OptionalResult.SUCCESS && webtoonInfo.data) {
                let addResult: Optional<any> = await this.webtoonInfoService.addWebtoonInfo({
                    webtoonId: webtoonInfo.data.titleId,
                    provider: WebtoonProvider.NAVER,
                    articleStart: naverWebtoonAddInfoQuery.articleStart,
                    articleEnd: naverWebtoonAddInfoQuery.articleEnd,
                    commentTarget: naverWebtoonAddInfoQuery.commentTargetType,
                    maxType: naverWebtoonAddInfoQuery.commentMaxCountType,
                    maxSize: naverWebtoonAddInfoQuery.maxSize,
                    isAccess: naverWebtoonAddInfoQuery.isAccess,
                });

                return addResult;
            }else {
                result.result = OptionalResult.FAIL;
                result.message = "네이버 웹툰 데이터 삽입 중 데이터베이스에서 오류가 발생하였습니다.";
            }
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.addNaverWebtoonInfo.name,
                error: error,
                input: JSON.stringify(naverWebtoonAddInfoQuery),
                moreMessage: "네이버 웹툰 데이터 삽입 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 데이터 수정
     */
    async editNaverWebtoonInfo(naverWebtoonInfoEditQuery: NaverWebtoonInfoEditQuery): Promise<Optional<any>> {
        try {
            if (naverWebtoonInfoEditQuery.webtoonInfo.provider || naverWebtoonInfoEditQuery.webtoonInfo.webtoonId)
                return { result: OptionalResult.FAIL, message: "네이버 웹툰 데이터 수정 기능은 provider 또는 webtoonId를 수정할 수 없습니다." };

            const result: Optional<any> = await this.webtoonInfoService.editWebtoonInfo({
                webtoonId: naverWebtoonInfoEditQuery.webtoonId,
                webtoonProvider: WebtoonProvider.NAVER,
                webtoonInfo: naverWebtoonInfoEditQuery.webtoonInfo
            });

            return result;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.editNaverWebtoonInfo.name,
                error: error,
                input: JSON.stringify(naverWebtoonInfoEditQuery),
                moreMessage: "네이버 웹툰 데이터 수정 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 데이터 제거
     */
    async removeNaverWebtoonInfo(naverWebtoonRemoveInfoQuery: NaverWebtoonRemoveInfoQuery): Promise<Optional<any>> {
        try {
            let addResult: Optional<any> = await this.webtoonInfoService.removeWebtoonInfo({
                webtoonId: naverWebtoonRemoveInfoQuery.webtoonId,
                provider: naverWebtoonRemoveInfoQuery.webtoonProvider,
            });

            return addResult;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.removeNaverWebtoonInfo.name,
                error: error,
                input: JSON.stringify(naverWebtoonRemoveInfoQuery),
                moreMessage: "네이버 웹툰 데이터 제거 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 데이터 존재 여부 확인
     */
    async isExistNaverWebtoonInfo(naverWebtoonInfoExistQuery: NaverWebtoonInfoExistQuery): Promise<Optional<boolean>> {
        try {
            let isExist: Optional<boolean> = await this.webtoonInfoService.isExistWebtoonInfo({
                webtoonId: naverWebtoonInfoExistQuery.webtoonId,
                provider: WebtoonProvider.NAVER,
            });

            return isExist;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.isExistNaverWebtoonInfo.name,
                error: error,
                input: JSON.stringify(naverWebtoonInfoExistQuery),
                moreMessage: "네이버 웹툰 데이터 존재 여부 확인 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 분석 데이터 불러오기
     */
    async getRequestNaverWebtoonAnalysis(naverWebtoonAnalyzeRequestGetQuery : NaverWebtoonAnalyzeRequestGetQuery): Promise<Optional<WebtoonRequestInfoEntity>> {
        try {
            const result : Optional<WebtoonRequestInfoEntity> = await this.webtoonInfoService.getWebtoonAnalyzeRequest({
                id: naverWebtoonAnalyzeRequestGetQuery.id,
            });

            return result;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getRequestNaverWebtoonAnalysis.name,
                error: error,
                input: JSON.stringify(naverWebtoonAnalyzeRequestGetQuery),
                moreMessage: "네이버 웹툰 분석 신청 데이터를 불러오는 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage }; 
        }
    }

    /**
     * 네이버 웹툰 분석 신청
     */
    async addRequestNaverWebtoonAnalysis(naverWebtoonAnalyzeRequestAddQuery : NaverWebtoonAnalyzeRequestAddQuery): Promise<Optional<any>> {
        try {
            let isExist: Optional<boolean> = await this.webtoonInfoService.isExistWebtoonInfo({
                webtoonId: naverWebtoonAnalyzeRequestAddQuery.webtoonId,
                provider: WebtoonProvider.NAVER,
            });

            if (isExist.result == OptionalResult.SUCCESS) {        
                const tokenUserInfo = await this.userService.checkUserAccountIsAllowForToken({token: naverWebtoonAnalyzeRequestAddQuery.token});
                if (tokenUserInfo.result == OptionalResult.FAIL) {
                    return { result: OptionalResult.FAIL, message: "분석을 요청한 사용자의 토큰이 유효하지 않습니다." }
                }

                const result : Optional<any> = await this.webtoonInfoService.addWebtoonAnalyzeRequest({
                    webtoonInfo: {
                        requestUserId: tokenUserInfo.data.id,
                        webtoonId: naverWebtoonAnalyzeRequestAddQuery.webtoonId,
                        provider: WebtoonProvider.NAVER,
                        articleStart: naverWebtoonAnalyzeRequestAddQuery.articleStart,
                        articleEnd: naverWebtoonAnalyzeRequestAddQuery.articleEnd,
                        commentTarget: naverWebtoonAnalyzeRequestAddQuery.commentTargetType,
                        maxType: naverWebtoonAnalyzeRequestAddQuery.commentMaxCountType,
                        maxSize: naverWebtoonAnalyzeRequestAddQuery.maxSize,
                    }
                });

                return result;
            }else {
                return { result: OptionalResult.FAIL, message: "네이버 웹툰 분석 신청 중 기존 웹툰 정보를 불러오는 과정에서 오류가 발생하였습니다." };
            }
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.addRequestNaverWebtoonAnalysis.name,
                error: error,
                input: JSON.stringify(naverWebtoonAnalyzeRequestAddQuery),
                moreMessage: "네이버 웹툰 데이터 존재 여부 확인 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 분석 신청
     */
    async getAllRequestNaverWebtoonAnalysis(): Promise<Optional<any>> {
        try {
            return await this.webtoonInfoService.getAllWebtoonAnalyzeRequest();
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.getAllRequestNaverWebtoonAnalysis.name,
                error: error,
                moreMessage: "네이버 웹툰 분석 신청 데이터를 모두 불러오는 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 네이버 웹툰 분석 신청 취소
     */
    async removeRequestNaverWebtoonAnalysis(naverWebtoonAnalyzeRequestRemoveQuery : NaverWebtoonAnalyzeRequestRemoveQuery): Promise<Optional<any>> {
        try {
            const tokenUserInfo = await this.userService.checkUserAccountIsAllowForToken({token: naverWebtoonAnalyzeRequestRemoveQuery.token});
            if (tokenUserInfo.result == OptionalResult.FAIL) {
                return { result: OptionalResult.FAIL, message: "분석을 요청한 사용자의 토큰이 유효하지 않습니다." }
            }

            const result : Optional<any> = await this.webtoonInfoService.removeWebtoonAnalyzeRequest({
                id: tokenUserInfo.data.id,
            });

            return result;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.removeRequestNaverWebtoonAnalysis.name,
                error: error,
                input: JSON.stringify(naverWebtoonAnalyzeRequestRemoveQuery),
                moreMessage: "네이버 웹툰 분석 신청 취소 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage }; 
        }
    }

    /**
     * 네이버 웹툰 분석 신청 취소
     */
    async removeRequestNaverWebtoonAnalysisForAdmin(naverWebtoonAnalyzeRequestRemoveForAdminQuery : NaverWebtoonAnalyzeRequestRemoveForAdminQuery): Promise<Optional<any>> {
        try {
            const result : Optional<any> = await this.webtoonInfoService.removeWebtoonAnalyzeRequest({
                id: naverWebtoonAnalyzeRequestRemoveForAdminQuery.id,
            });

            return result;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.removeRequestNaverWebtoonAnalysisForAdmin.name,
                error: error,
                input: JSON.stringify(naverWebtoonAnalyzeRequestRemoveForAdminQuery),
                moreMessage: "네이버 웹툰 분석 신청 취소 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage }; 
        }
    }

    /**
     * 네이버 웹툰 분석 신청 확인
     */
    async checkRequestNaverWebtoonAnalysis(naverWebtoonAnalyzeRequestCheckQuery : NaverWebtoonAnalyzeRequestCheckQuery): Promise<Optional<any>> {
        try {
            const tokenUserInfo = await this.userService.checkUserAccountIsAllowForToken({token: naverWebtoonAnalyzeRequestCheckQuery.token});
            if (tokenUserInfo.result == OptionalResult.FAIL) {
                return { result: OptionalResult.FAIL, message: "분석을 요청한 사용자의 토큰이 유효하지 않습니다." }
            }

            const result : Optional<any> = await this.webtoonInfoService.checkWebtoonAnalyzeRequest({
                id: tokenUserInfo.data.id,
            });

            return result;
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.checkRequestNaverWebtoonAnalysis.name,
                error: error,
                input: JSON.stringify(naverWebtoonAnalyzeRequestCheckQuery),
                moreMessage: "네이버 웹툰 분석 신청 확인 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage }; 
        }
    }
}
