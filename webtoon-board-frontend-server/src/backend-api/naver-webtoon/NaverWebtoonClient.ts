import dayjs from "dayjs";
import { REQUEST_URL, getAxiosPostClientNoAuthorization, getFullURL } from "../ApiClient";
import { errorFormat } from "../ErrorStringFormat";

const API_RESULT_SUCCESS : string = "SUCCESS";

export async function getRegisteredNaverWebtoonAllInfoNoOffset(token: string) : Promise<any> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), {
            "path": "naver-webtoon/get-all-db",
            "parm": "isUseOffset=false",
            "defaultAuthInfoDTO": {
                "token": token,
            },
        });

        if (!result.data || !result.data.data || result.data.result != API_RESULT_SUCCESS) {
            throw new Error("등록된 모든 네이버 웹툰 정보를 가져오는데 실패하였습니다.");
        }

        return result.data.data;
    }catch (error: any) {
        throw new Error(errorFormat(getRegisteredNaverWebtoonAllInfoNoOffset.name, error));
    }
}

export async function checkIsAccessWebtoonInfo(webtoonId: string, token: string) : Promise<boolean> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), {
            "path": "naver-webtoon/get-db",
            "parm": `webtoonId=${webtoonId}`,
            "defaultAuthInfoDTO": {
                "token": token,
            },
        });

        if (!result.data || !result.data.data || result.data.result != API_RESULT_SUCCESS) {
            throw new Error("네이버 웹툰 접근 권한을 확인하는데 실패하였습니다.");
        }

        return result.data.data.data.isAccess == 0 ? true : false;
    }catch (error: any) {
        throw new Error(errorFormat(checkIsAccessWebtoonInfo.name, error));
    }
}

export async function getWebtoonAnaylzeInfoFromDB(webtoonId: string, token: string) : Promise<boolean> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), {
            "path": "naver-webtoon/get-db",
            "parm": `webtoonId=${webtoonId}`,
            "defaultAuthInfoDTO": {
                "token": token,
            },
        });

        if (!result.data || !result.data.data || result.data.result != API_RESULT_SUCCESS) {
            throw new Error("특정 네이버 웹툰 정보를 가져오는데 실패하였습니다.");
        }

        return result.data.data.data;
    }catch (error: any) {
        throw new Error(errorFormat(getWebtoonAnaylzeInfoFromDB.name, error));
    }
}

export async function getWebtoonInfo(webtoonId: string, token: string) : Promise<any> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), {
            "path": "naver-webtoon/info",
            "parm": `webtoonId=${webtoonId}`,
            "defaultAuthInfoDTO": {
                "token": token,
            },
        });

        if (!result.data || !result.data.data || result.data.result != API_RESULT_SUCCESS) {
            throw new Error("특정 네이버 웹툰 정보를 가져오는데 실패하였습니다.");
        }

        return result.data.data.data;
    }catch (error: any) {
        throw new Error(errorFormat(getWebtoonInfo.name, error));
    }
}

export async function getCommentAnalyzeResult(webtoonId: string, token: string) : Promise<any> {
    try {
        const result : Array<any> = new Array<any>();
        let searchAfter : number = -1;
        while (true) {
            const query : any = {
                "path": "elasticsearch/index-item",
                "defaultAuthInfoDTO": {
                    "token": token
                },
                "body": {
                    "index": "webtoon_board_naver_comment",
                    "query": {
                        "match": {
                            "webtoon_id": webtoonId
                        }
                    },
                    "sort": [
                        {
                            "article": "asc"
                        }
                    ],
                    "size": 500,
                    "searchAfter": searchAfter,
                }
            }

            if (searchAfter == -1) {
                delete query.body.searchAfter;
            }
    
            const list : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), query);
    
            if (!list.data || !list.data.data || list.data.result != API_RESULT_SUCCESS) {
                throw new Error("특정 네이버 웹툰 댓글 분석 정보를 가져오는데 실패하였습니다.");
            }

            if ((list.data.data.data.hits.hits as Array<any>).length <= 0) {
                break;
            }

            result.push(...(list.data.data.data.hits.hits as Array<any>));
            searchAfter = result.at(-1).sort[0] as number;
        }

        return result;
    }catch (error: any) {
        throw new Error(errorFormat(getCommentAnalyzeResult.name, error));
    }
}

export async function getCommentWordFrequencyInfo(webtoonId: string, token: string) : Promise<any> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), {
            "path": "comment-word-frequency/get",
            "parm": `webtoonId=${webtoonId}&webtoonProvider=NAVER`,
            "defaultAuthInfoDTO": {
                "token": token,
            },
        });

        if (!result.data || !result.data.data || result.data.result != API_RESULT_SUCCESS) {
            throw new Error("특정 네이버 웹툰 댓글 단어 출현 빈도 정보를 가져오는데 실패하였습니다.");
        }

        return result.data.data.data.frequency;
    }catch (error: any) {
        throw new Error(errorFormat(getCommentWordFrequencyInfo.name, error));
    }
}

export async function getWebtoonSimpleSearchListForNaverWebtoon(keyword: string, token: string) : Promise<any> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), {
            "path": "naver-webtoon/simple-search",
            "parm": `keyword=${keyword}`,
            "defaultAuthInfoDTO": {
                "token": token,
            },
        });

        if (!result.data || !result.data.data || result.data.result != API_RESULT_SUCCESS) {
            return undefined;
        }

        return result.data.data.data;
    }catch (error: any) {
        throw new Error(errorFormat(getWebtoonSimpleSearchListForNaverWebtoon.name, error));
    }
}

export async function getWebtoonArticleTotalCountForNaverWebtoon(webtoonId: string, token: string) : Promise<number> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), {
            "path": "naver-webtoon/article",
            "parm": `webtoonId=${webtoonId}`,
            "defaultAuthInfoDTO": {
                "token": token,
            },
        });

        if (!result.data || !result.data.data || result.data.result != API_RESULT_SUCCESS) {
            return 0;
        }

        return result.data.data.data.totalCount;
    }catch (error: any) {
        throw new Error(errorFormat(getWebtoonArticleTotalCountForNaverWebtoon.name, error));
    }
}

export async function pushWebtoonAnaylzeRequestForNaverWebtoon(token: string, webtoonId: string, articleStart: number, articleEnd: number, commentTargetType: string, commentMaxCountType: string, maxSize: number) : Promise<any> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.NAVER_WEBTOON__ANALYZE_REQUEST_ADD), {
            "token": token,
            "webtoonId": webtoonId,
            "articleStart": articleStart,
            "articleEnd": articleEnd,
            "commentTargetType": commentTargetType,
            "commentMaxCountType": commentMaxCountType,
            "maxSize": maxSize
        });
        
        if (!result.data || result.data.result != API_RESULT_SUCCESS) {
            return false;
        }

        return result.data.result == API_RESULT_SUCCESS ? true : false;
    }catch (error: any) {
        throw new Error(errorFormat(getAxiosPostClientNoAuthorization.name, error));
    }
}

export async function removeWebtoonAnaylzeRequestForNaverWebtoon(token: string) : Promise<any> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.NAVER_WEBTOON__ANALYZE_REQUEST_REMOVE), {
            "token": token,
        });
        
        if (!result.data || result.data.result != API_RESULT_SUCCESS) {
            return false;
        }

        return result.data.result == API_RESULT_SUCCESS ? true : false;
    }catch (error: any) {
        throw new Error(errorFormat(removeWebtoonAnaylzeRequestForNaverWebtoon.name, error));
    }
}

export async function checkWebtoonAnaylzeRequestForNaverWebtoon(token: string) : Promise<any> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.NAVER_WEBTOON__ANALYZE_REQUEST_CHECK), {
            "token": token,
        });
        
        if (!result.data || result.data.result != API_RESULT_SUCCESS || !result.data.data) {
            return false;
        }

        return result.data.data ? true : false;
    }catch (error: any) {
        throw new Error(errorFormat(checkWebtoonAnaylzeRequestForNaverWebtoon.name, error));
    }
}

export async function getNaverWebtoonArticleListForPage(webtoonId: string, page:number = 1, token: string) : Promise<any> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), {
            "path": "naver-webtoon/article",
            "parm": `webtoonId=${webtoonId}&page=${page}`,
            "defaultAuthInfoDTO": {
                "token": token,
            },
        });

        if (!result.data || !result.data.data || !result.data.data.data || !result.data.data.data.articleList || result.data.result != API_RESULT_SUCCESS) {
            return [];
        }

        return result.data.data.data;
    }catch (error: any) {
        throw new Error(errorFormat(getNaverWebtoonArticleListForPage.name, error));
    }
}

export async function getNaverWebtoonRecommendList(webtoonId: string, token: string) : Promise<any> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), {
            "path": "naver-webtoon/recommend",
            "parm": `webtoonId=${webtoonId}`,
            "defaultAuthInfoDTO": {
                "token": token,
            },
        });

        if (!result.data || !result.data.data || !result.data.data.data || result.data.result != API_RESULT_SUCCESS) {
            return [];
        }

        return result.data.data.data;
    }catch (error: any) {
        throw new Error(errorFormat(getNaverWebtoonRecommendList.name, error));
    }
}

export async function getNaverWebtoonDaliyList(token: string) : Promise<any> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), {
            "path": "naver-webtoon/daliy",
            "defaultAuthInfoDTO": {
                "token": token,
            },
        });

        if (!result.data || !result.data.data || !result.data.data.data || result.data.result != API_RESULT_SUCCESS) {
            throw new Error(errorFormat(getNaverWebtoonDaliyList.name, "네이버 웹툰 일간 리스트 조회 실패!"));
        }

        return result.data.data.data;
    }catch (error: any) {
        throw new Error(errorFormat(getNaverWebtoonDaliyList.name, error));
    }
}

export async function getCommentAnalyzeResultUseTimeGetCount(timeStart: string, timeEnd: string, commentType: boolean, token: string) : Promise<any> {
    try {
        const query : any = {
            "path": "elasticsearch/index-item-count-use-where",
            "defaultAuthInfoDTO": {
                "token": token
            },
            "body": {
                "index": "webtoon_board_naver_comment",
                "query": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "write_date": {
                                        "gte": dayjs(timeStart).format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
                                        "lte": dayjs(timeEnd).format('YYYY-MM-DDTHH:mm:ss.000ZZ')
                                    }
                                }
                            },
                            {
                                "match": {
                                    "comment_result": commentType
                                }
                            }
                        ]
                    }
                },
            }
        };

        const list : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), query);

        if (!list.data || !list.data.data || list.data.result != API_RESULT_SUCCESS) {
            throw new Error("특정 네이버 웹툰 댓글 분석 정보를 가져오는데 실패하였습니다.");
        }

        return list.data.data.data.count;
    }catch (error: any) {
        throw new Error(errorFormat(getCommentAnalyzeResultUseTimeGetCount.name, error));
    }
}

export async function getCommentDoubleValueAVG(commentType: boolean, token: string) : Promise<any> {
    try {
        const query : any = {
            "path": "elasticsearch/index-item",
            "defaultAuthInfoDTO": {
                "token": token
            },
            "body": {
                "index": "webtoon_board_naver_comment",
                "size": 0,
                "aggs": {
                    "comment_double_avg": {
                        "filter": { "term": { "comment_result": commentType } },
                        "aggs": {
                            "comment_double_avg": {
                                "avg": {
                                    "field": "comment_double"
                                }
                            }
                        }
                    }
                },
            }
        };

        const list : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), query);

        if (!list.data || !list.data.data || list.data.result != API_RESULT_SUCCESS) {
            throw new Error("특정 네이버 웹툰 댓글 분석 정보를 가져오는데 실패하였습니다.");
        }

        return list.data.data.data.aggregations.comment_double_avg.comment_double_avg.value;
    }catch (error: any) {
        throw new Error(errorFormat(getCommentDoubleValueAVG.name, error));
    }
}

export async function getAllCommentDoubleValueAVG(token: string) : Promise<any> {
    try {
        const query : any = {
            "path": "elasticsearch/index-item",
            "defaultAuthInfoDTO": {
                "token": token
            },
            "body": {
                "index": "webtoon_board_naver_comment",
                "size": 0,
                "aggs": {
                    "comment_double_avg": {
                        "avg": {
                            "field": "comment_double"
                        }
                    }
                },
            }
        };

        const list : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), query);

        if (!list.data || !list.data.data || list.data.result != API_RESULT_SUCCESS) {
            throw new Error("특정 네이버 웹툰 댓글 분석 정보를 가져오는데 실패하였습니다.");
        }

        return list.data.data.data.aggregations.comment_double_avg.value;
    }catch (error: any) {
        throw new Error(errorFormat(getCommentDoubleValueAVG.name, error));
    }
}

export async function getAllCommentCountRanking(token: string) : Promise<any> {
    try {
        const query : any = {
            "path": "elasticsearch/index-item",
            "defaultAuthInfoDTO": {
                "token": token
            },
            "body": {
                "index": "webtoon_board_naver_comment",
                "size": 0,
                "aggs": {
                    "webtoon_comment_counts": {
                        "terms": {
                            "field": "webtoon_id",
                            "size": 5,
                        }
                    }
                },
            }
        };

        const list : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.CONTROLLER_LINKER__RULE_BASED), query);
        
        if (!list.data || !list.data.data || list.data.result != API_RESULT_SUCCESS) {
            throw new Error("네이버 웹툰 댓글 분석 정보를 가져오는데 실패하였습니다.");
        }

        return list.data.data.data.aggregations.webtoon_comment_counts.buckets;
    }catch (error: any) {
        throw new Error(errorFormat(getAllCommentCountRanking.name, error));
    }
}