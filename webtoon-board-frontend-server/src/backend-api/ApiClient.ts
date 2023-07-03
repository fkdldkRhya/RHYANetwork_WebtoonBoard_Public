import axios, { AxiosResponse } from "axios";

// Backend API Server URL
export const REQUEST_URL = {
    USER__SEND_SIGN_UP_AUTH_CODE_EMAIL: '/user/send-sign-up-auth-code',
    USER__CHECK_USER_ACCOUNT_IS_ALLOW: '/user/check-user-account-is-allow',
    USER__FIND_ID_AND_PASSWORD_ENC: '/user/find-id-and-password-for-frontend-login-only',
    USER__FIND_ID: '/user/find',
    USER__ADD: '/user/add-default',
    USER__CHECK_EMAIL_AUTH_CODE: '/user/email-auth-code-check',
    USER__UPDATE_PASSWORD_FOR_FRONTEND_ONLY: '/user/update-password-for-frontend-only',
    USER__UPDATE_FOR_FRONTEND_ONLY: '/user/update-for-frontend-only',
    NAVER_WEBTOON__ANALYZE_REQUEST_ADD: '/naver-webtoon/anlayze-request-add',
    NAVER_WEBTOON__ANALYZE_REQUEST_REMOVE: '/naver-webtoon/anlayze-request-remove',
    NAVER_WEBTOON__ANALYZE_REQUEST_CHECK: '/naver-webtoon/anlayze-request-check',
    CONTROLLER_LINKER__RULE_BASED: '/login-user-task/rule-based-controller-linker',
} as const;

/**
 * Backend API Server의 URL을 반환합니다.
 */
export function getFullURL(url: string, parm?: {[key: string]: any;}) {
    try {
        let host;

        if (process.env.NEXT_PUBLIC_WBF_USE_BACK_ADDRESS == "public") {
            host = process.env.NEXT_PUBLIC_WEBTOON_BOARD_BACKEND_API_HOST_PRODUCTION;
        }else if (process.env.NEXT_PUBLIC_WBF_USE_BACK_ADDRESS == "local"){
            host = process.env.NEXT_PUBLIC_WEBTOON_BOARD_BACKEND_API_HOST;
        }else {
            host = process.env.NEXT_PUBLIC_WEBTOON_BOARD_BACKEND_API_HOST_PRODUCTION;
        }

        if (parm) {
            let fullParm: string[] = [];
            Object.keys(parm).forEach((key) => {
                fullParm.push(`${key}=${parm[key]}`);
            });
            
            return `${host}${url}?${fullParm.join("&")}`;
        }else {
            return `${host}${url}`;
        }
    }catch(error: any) {
        throw error;
    }
}

/**
 * POST 요청을 보내는 Axios 클라이언트를 반환합니다.
 */
export async function getAxiosPostClient(url: string, body?: {}) : Promise<AxiosResponse<any, any>> {
    return await axios.post(
        url,
        body, 
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.BACKEND_API_ACCESS_KEY
            }
        });
}

/**
 * POST 요청을 보내는 Axios 클라이언트를 반환합니다. (Authorization 포함 안함)
 */
export async function getAxiosPostClientNoAuthorization(url: string, body?: {}) : Promise<AxiosResponse<any, any>> {
    return await axios.post(
        url,
        body, 
        {
            headers: {
                "Content-Type": "application/json"
            }
        });
}

/**
 * GET 요청을 보내는 Axios 클라이언트를 반환합니다.
 */
export async function getAxiosGetClient(url: string) : Promise<AxiosResponse<any, any>> {
    return await axios.get(
        url, 
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.BACKEND_API_ACCESS_KEY
            }
        });
}

/**
 * GET 요청을 보내는 Axios 클라이언트를 반환합니다. (Authorization 포함 안함)
 */
export async function getAxiosGetClientNoAuthorization(url: string) : Promise<AxiosResponse<any, any>> {
    return await axios.get(
        url, 
        {
            headers: {
                "Content-Type": "application/json"
            }
        });
}


/**
 * GET 요청을 보내는 Fetch 클라이언트를 반환합니다.
 */
export async function getFetchGetClient(url: string) : Promise<Response> {
    const key : any = process.env.BACKEND_API_ACCESS_KEY;
    
    return await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": key
        }
    })
}