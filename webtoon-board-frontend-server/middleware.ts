import { AUTO_LOGIN_COOKIE_NAME, LOGIN_COOKIE_NAME, getAutoLoginUserIdFromCookieValue, isCheckAllowAccessUser, isNotDisabledUser, isNotEmailAuthUser, userLogout } from '@/backend-api/auth/LoginChecker';
import { checkUserAccountIsAlowMiddlewareOnly } from '@/backend-api/client/UserInfoClient';
import { NextRequest, NextResponse } from 'next/server';
import url from 'url';

export enum PagePath {
    DASHBOARDS_MODERN = "/",
    AUTH_AUTH1_LOGIN = "/auth/auth1/login",
    AUTH_AUTH1_REGISTER = "/auth/auth1/register",
    AUTH_AUTH1_TWOSTEPS = "/auth/auth1/two-steps",
    AUTH_AUTH1_LOGOFF = "/auth/auth1/logoff",
    WEBTOON_LIST = "/apps/webtoon-list",
    WEBTOON_DETAIL_INFO_FOR_NAVER = "/apps/webtoon-info/naver",
    WEBTOON_DALIY_LIST = "/apps/webtoon-daliy/naver",
    WEBTOON_REQUEST = "/forms/webtoon-analyze-request",
    CHARTS_WEBTOON_COMMENT_ANALYZE_RESULT_FOR_NAVER = "/charts/comment-analyze-result/naver",
    THEME_PAGES_ACCOUNT_SETTINGS = "/theme-pages/account-settings",
    COPYRIGHT = "/copyright",
    ERROR_404 = "/error",
    STOP = "/stop"
}

export async function middleware(req: NextRequest) {
    const { pathname } = url.parse(req.url || '', true);
    if (
        pathname == "/" ||
        pathname?.startsWith("/apps") ||
        pathname?.startsWith("/auth") ||
        pathname?.startsWith("/charts") ||
        pathname?.startsWith("/dashboard") ||
        pathname?.startsWith("/forms") ||
        pathname?.startsWith("/landingpage") ||
        pathname?.startsWith("/tables") ||
        pathname?.startsWith("/theme-pages") ||
        pathname?.startsWith("/ui-components") ||
        pathname?.startsWith("/widgets")
    ) {
        // 페이지 접근 허용 확인
        // ================================================
        // ================================================
        let isAllowPageAccess: boolean = false;
        Object.values(PagePath).forEach(path => {
            if (pathname == PagePath.DASHBOARDS_MODERN) {
                isAllowPageAccess = true;
                return false;
            }else if (pathname == path) {
                isAllowPageAccess = true;
                return false;
            }else {
                if (
                    pathname.includes(PagePath.WEBTOON_LIST) ||
                    pathname.includes(PagePath.WEBTOON_DETAIL_INFO_FOR_NAVER) ||
                    pathname.includes(PagePath.CHARTS_WEBTOON_COMMENT_ANALYZE_RESULT_FOR_NAVER)
                ) {
                    isAllowPageAccess = true;
                    return false;
                }
            }
        });

        // 접근 가능 페이지가 아닐 경우 메인 페이지로 이동
        if (!isAllowPageAccess) {
            return NextResponse.redirect(new URL(PagePath.DASHBOARDS_MODERN, req.url));
        }
        // ================================================
        // ================================================


        // 로그인 여부 확인
        // ================================================
        // ================================================
        // 로그인 여부 확인 제외 페이지
        const loginCheckBlackList : string[] = [
            PagePath.AUTH_AUTH1_LOGIN,
            PagePath.AUTH_AUTH1_REGISTER,
            PagePath.AUTH_AUTH1_TWOSTEPS,
            PagePath.ERROR_404,
        ];
        // 로그인 여부 확인 제외 페이지가 아닐 경우 로그인 여부 확인
        if (!loginCheckBlackList.includes(pathname)) {
            // 로그인 여부 확인
            // -1  : 로그인 오류 및 실패
            // 0 ~ : 로그인 성공 (사용자 ID)
            let isLogin : number;

            // 예외 처리
            try {
                // 쿠키 데이터 추출 및 로그인 여부 확인
                if (req.cookies.has(LOGIN_COOKIE_NAME) && req.cookies.get(LOGIN_COOKIE_NAME)?.value) {
                    // 자동 로그인 데이터 출력
                    isLogin = getAutoLoginUserIdFromCookieValue(req.cookies.get(LOGIN_COOKIE_NAME)?.value as string);
                    // 자동 로그인 데이터 확인
                    if (isLogin >= 0) {
                        const result : any = await checkUserAccountIsAlowMiddlewareOnly(isLogin, req);
                        // 정상 사용자가 아닐 경우
                        if (!isCheckAllowAccessUser(result)) {
                            // 이메일 인증 사용자인지 확인
                            if (isNotEmailAuthUser(result)) {
                                // 인증 페이지로 이동
                                return NextResponse.redirect(new URL(PagePath.AUTH_AUTH1_TWOSTEPS, req.url));
                            }

                            // 사용자가 비활성화 상태 인지 확인
                            if (!isNotDisabledUser(result)) {
                                // 차단 페이지로 이동
                                return NextResponse.rewrite(new URL(PagePath.ERROR_404, req.url));
                            }
                        }
                    }
                }else {
                    // 로그인 오류 실패 시 -1 로 설정
                    isLogin = -1;
                }
            }catch {
                // 로그인 오류 발생 시 -1 로 설정
                isLogin = -1;
            }

            // 로그인 성공 여부 확인
            if (isLogin < 0 || isLogin == -1) { // 로그인 실패 시 로그인 페이지로 이동
                // 자동 로그인 토큰 제거
                req.cookies.delete(LOGIN_COOKIE_NAME);
                req.cookies.delete(AUTO_LOGIN_COOKIE_NAME);
                
                // 로그인 페이지로 이동
                return NextResponse.redirect(new URL(PagePath.AUTH_AUTH1_LOGIN, req.url))
            }
        }
        // ================================================
        // ================================================
    }
}
