
import { AES, enc } from 'crypto-js'
import moment from 'moment';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export const LOGIN_COOKIE_NAME: string = "LOGIN_SESSION_VALUE";
export const AUTO_LOGIN_COOKIE_NAME: string = "AUTO_LOGIN_SESSION_VALUE";

export interface LoginResultDTO {
    result: boolean;
    message?: string;
    user?: any;
}

export function setSessionAutoLoginValue(req: any, res: any) {
    try {
        const id: number = getAutoLoginUserId(req, res);
        const key: any = process.env.LOGIN_COOKIE_AES_SECRET_KEY;
        const date: string = moment().format('YYYY-MM-DD HH:mm:ss');
        const newEncryptValue: string = AES.encrypt(`${id}#${date}`, key).toString();

        deleteCookie(LOGIN_COOKIE_NAME, {req, res});

        const isAutoLoginRequest = getCookie(AUTO_LOGIN_COOKIE_NAME, {req, res}) as boolean;

        if (isAutoLoginRequest && isAutoLoginRequest == true) {
            let cookieAge = 60 * 60 * 24 * 14; // 2 weeks
            setCookie(LOGIN_COOKIE_NAME, newEncryptValue, {
                req,
                res,
                maxAge: cookieAge,
            });
            setCookie(AUTO_LOGIN_COOKIE_NAME, true, {
                req,
                res,
                maxAge: cookieAge,
            });
        }else {
            deleteCookie(AUTO_LOGIN_COOKIE_NAME, {req, res});
            setCookie(LOGIN_COOKIE_NAME, newEncryptValue, {req, res});
        }
    }catch(error: any) {
        throw error;
    }
}

export function getAutoLoginUserId(req: any, res: any): number {
    try {
        return getAutoLoginUserIdFromCookieValue(getCookie(LOGIN_COOKIE_NAME, {req, res}) as string)
    }catch (error) {
        throw error;
    }
}

export function getAutoLoginUserIdFromCookieValue(cookieValue : string): number {
    try {
        const key: any = process.env.LOGIN_COOKIE_AES_SECRET_KEY;
        const decrypt: string = AES.decrypt(decodeURI(cookieValue), key).toString(enc.Utf8);
        const split: string[] = decrypt.split("#");

        if (
            split.length == 2 &&
            split[0] &&
            split[1] && 
            !moment().isAfter(moment(split[1]).add(90, 'minutes'))
        ) {
            const result: number = parseInt(split[0]); 
    
            if (!result) {
                throw new Error("Invalid Login Session!!");
            }
    
            return result;
        }

        return -1;
    }catch (error) {
        throw error;
    }
}

export function userLogout(req: any, res: any) {
    try {
        deleteCookie(LOGIN_COOKIE_NAME, {req, res});
        deleteCookie(AUTO_LOGIN_COOKIE_NAME, {req, res});
    }catch (error) {
        throw error;
    }
}

export function isNotDisabledUser(value: any) : boolean {
    if (!value.data) return false;

    return value.data != "DISABLED";
}

export function isNotEmailAuthUser(value: any) : boolean {
    if (!value.data) return true;

    return value.data == "NOT_EMAIL_AUTH";
}

export function isCheckAllowAccessUser(value: any) : boolean {
    if (!value.data) return false;

    return value.data == "SUCCESS";
}