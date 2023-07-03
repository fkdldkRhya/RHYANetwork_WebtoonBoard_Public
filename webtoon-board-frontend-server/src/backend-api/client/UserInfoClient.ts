import { GetServerSidePropsContext } from "next";
import { REQUEST_URL, getAxiosGetClient, getAxiosGetClientNoAuthorization, getAxiosPostClientNoAuthorization, getFetchGetClient, getFullURL } from "../ApiClient";
import { errorFormat } from "../ErrorStringFormat";
import { NextRequest } from "next/server";

const API_RESULT_SUCCESS : string = "SUCCESS";

export async function checkUserAccountIsAlow(id: number, context: GetServerSidePropsContext) : Promise<any> {
    try {
        if (!context) throw new Error(errorFormat(checkUserAccountIsAlow.name, "Server Side Props Context is null!"));

        const result = await getAxiosGetClient(getFullURL(REQUEST_URL.USER__CHECK_USER_ACCOUNT_IS_ALLOW, {
            "id": id.toString()
        }));

        if (result.status == 200 && result.data.data) {
            return result.data;
        }

        throw new Error(errorFormat(checkUserAccountIsAlow.name, "User not found!"));
    }catch (error: any) {
        throw new Error(errorFormat(checkUserAccountIsAlow.name, error));
    }
}

export async function checkUserAccountIsAlowMiddlewareOnly(id: number, req : NextRequest) : Promise<any> {
    try {
        if (!req) throw new Error(errorFormat(checkUserAccountIsAlowMiddlewareOnly.name, "NextRequest is null!"));

        const result : Response = await getFetchGetClient(getFullURL(REQUEST_URL.USER__CHECK_USER_ACCOUNT_IS_ALLOW, {
            "id": id.toString()
        }));

        return result.json().then((data) => {
            if (result.status == 200 && data) {
                return data;
            }else {
                throw new Error(errorFormat(checkUserAccountIsAlowMiddlewareOnly.name, "User not found!"));
            }
        }).catch((error) => {
            throw new Error(errorFormat(checkUserAccountIsAlowMiddlewareOnly.name, error));
        });
    }catch (error: any) {
        throw new Error(errorFormat(checkUserAccountIsAlowMiddlewareOnly.name, error));
    }
}

export async function findUserFromIdValueClientForSSROnly(id: number, context: GetServerSidePropsContext) : Promise<any> {
    try {
        if (!context) throw new Error(errorFormat(findUserFromIdValueClientForSSROnly.name, "Server Side Props Context is null!"));

        return findUserFromIdValueClient(id)
    }catch (error: any) {
        throw new Error(errorFormat(findUserFromIdValueClientForSSROnly.name, error));
    }
}

export async function findUserFromIdValueClient(id: number) : Promise<any> {
    try {
        const result = await getAxiosGetClient(getFullURL(REQUEST_URL.USER__FIND_ID, {
            "id": id.toString()
        }));

        if (result.status == 200 && result.data.result == API_RESULT_SUCCESS && result.data.data) {
            return result.data.data;
        }

        throw new Error(errorFormat(findUserFromIdValueClient.name, "User not found!"));
    }catch (error: any) {
        throw new Error(errorFormat(findUserFromIdValueClient.name, error));
    }
}

export async function findUserFromIdAndPasswordEncryptValueClient(id: string, password: string): Promise<any> {
    try {
        const result = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.USER__FIND_ID_AND_PASSWORD_ENC), {
            "userId": id,
            "password": password
        });

        if (result.status == 201 && result.data.result == API_RESULT_SUCCESS && result.data.data) {
            return { result: true, data: result.data.data };
        }else {
            return { result: false };
        }
    }catch (error: any) {
        throw new Error(errorFormat(findUserFromIdAndPasswordEncryptValueClient.name, error));
    }
}

export async function addUserAccountClient(id: string, password: string, name: string, email: string): Promise<any> {
    try {
        const result : any = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.USER__ADD), {
            "userId": id,
            "password": password,
            "userName": name,
            "userEmail": email,
            "userDescription": "Webtoon Board Register User",
            "userRole": "DEFAULT"
        });

        if (result.status == 201 && result.data.result == API_RESULT_SUCCESS && result.data) {
            return { result: true };
        }else {
            return { result: false, data: result.data.message };
        }
    }catch (error: any) {
        throw new Error(errorFormat(addUserAccountClient.name, error));
    }
}

export async function sendAuthCodeEmailForSignup(id: string, context: GetServerSidePropsContext): Promise<any> {
    try {
        if (!context) throw new Error(errorFormat(sendAuthCodeEmailForSignup.name, "Server Side Props Context is null!"));

        const result = await getAxiosGetClient(getFullURL(REQUEST_URL.USER__SEND_SIGN_UP_AUTH_CODE_EMAIL, {
            "id": id.toString()
        }));

        if (result.status == 200 && result.data.result == API_RESULT_SUCCESS && result.data) {
            return { result: true, data: result.data };
        }else {
            return { result: false };
        }
    }catch (error: any) {
        throw new Error(errorFormat(sendAuthCodeEmailForSignup.name, error));
    }
}

export async function checkUserEmailAuthCode(id: number, requestCode: string, code: string, type: string) : Promise<boolean> {
    try {
        const result = await getAxiosGetClientNoAuthorization(getFullURL(REQUEST_URL.USER__CHECK_EMAIL_AUTH_CODE, {
            "id": id.toString(),
            "requestCode": requestCode,
            "code": code,
            "type": type
        }));

        if (result.status == 200 && result.data.result == API_RESULT_SUCCESS) {
            return true;
        }else {
            return false;
        }
    }catch (error: any) {
        throw new Error(errorFormat(checkUserEmailAuthCode.name, error));
    }
}

export async function updateUserPasswordForFrontend(id: string, password: string, newPassword: string) : Promise<boolean> {
    try {
        const result = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.USER__UPDATE_PASSWORD_FOR_FRONTEND_ONLY), {
            "userId": id,
            "password": password,
            "newPassword": newPassword
        });

        if (result.status == 201 && result.data.result == API_RESULT_SUCCESS) {
            return true;
        }else {
            return false;
        }
    }catch (error: any) {
        throw new Error(errorFormat(updateUserPasswordForFrontend.name, error));
    }
}

export async function updateUserInfoOnlyUserName(id: number, userId: string, token: string, userName: string) : Promise<boolean> {
    try {
        const result = await getAxiosPostClientNoAuthorization(getFullURL(REQUEST_URL.USER__UPDATE_FOR_FRONTEND_ONLY), {
            "id": id,
            "userId": userId,
            "token": token,
            "userInfo": {
                "userName": userName
            },
        });

        if (result.status == 201 && result.data.result == API_RESULT_SUCCESS) {
            return true;
        }else {
            return false;
        }
    }catch (error: any) {
        throw new Error(errorFormat(updateUserInfoOnlyUserName.name, error));
    }
}