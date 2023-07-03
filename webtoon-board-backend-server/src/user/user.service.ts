import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorLogFormat, getErrorMessage } from 'src/util/dto/error-log-format.service.dto';
import { Optional, OptionalResult } from 'src/util/dto/optional.dto';
import { MyLogger } from 'src/util/logger/my-logger.service';
import { Repository } from 'typeorm';
import { sha512 } from 'sha512-crypt-ts';
import { UserInfoFindDefaultQuery } from './dto/user-info-find-default.dto';
import { UserInfoFindIdAndPasswordQuery } from './dto/user-info-find-id-and-password.dto';
import { UserInfoFindIdQuery } from './dto/user-info-find-id.dto';
import { UserInfoEncryptEntityForFrontEndLoginOnly, UserInfoEntity, UserRole } from './entities/user-info.entity';
import { UserInfoAddQuery } from './dto/user-info-add.dto';
import { getRandomString } from './util/user.util';
import { UserInfoRemoveQuery } from './dto/user-info-remove.dto';
import { UserInfoUpdateQuery } from './dto/user-info-update.dto';
import * as moment from 'moment';
import { getAesDecryptionValueAsync, getAesEncryptionValueAsync } from 'src/util/crypto/aes.crypto';
import { AccountEmailAuthEntity, EmailAuthType } from 'src/util/email/entities/mail-auth.entities';
import { UserEmailAuthCodeQuery } from './dto/user-email-auth-code.dto';
import { MailService } from 'src/util/email/mail.service';
import { EmailAuthCodeSendResult } from 'src/util/email/dto/auth-code-result.dto';
import { UserUpdatePasswordForFrontendQuery } from './dto/user-update-password-for-frontend.dto';
import { DefaultAuthInfoDTO } from 'src/login-user-task/dto/auth-info-default.dto';
import { UserUpdateForFrontendQuery } from './dto/user-update-for-frontend.dto';

@Injectable()
export class UserService {
    // -----------------------------------------
    // Logger setting
    // -----------------------------------------
    private readonly LOGGER_CONTEXT_NAME: string = UserService.name;
    // -----------------------------------------

    constructor(
        @InjectRepository(AccountEmailAuthEntity) private readonly accountEmailAuthInfoRepository: Repository<AccountEmailAuthEntity>,
        @InjectRepository(UserInfoEntity) private readonly userInfoRepository: Repository<UserInfoEntity>,
        private readonly logger: MyLogger,
        private readonly mailService: MailService
    ) {
        this.userInfoRepository = userInfoRepository;
    }

    /**
     * 사용자 계정이 허용되었는지 확인
     */
    async checkUserAccountIsAllowForToken(defaultAuthInfoDTO: DefaultAuthInfoDTO): Promise<Optional<UserInfoEntity>> {
        try {
            const key: any = process.env.LOGIN_COOKIE_AES_SECRET_KEY;
            const splitOrg : string = await getAesDecryptionValueAsync(decodeURIComponent(defaultAuthInfoDTO.token), key);

            // Token 복호화 확인
            if (!splitOrg || !splitOrg.includes("#")) {
                return { result: OptionalResult.FAIL, message: "사용자 인증 Token 값이 잘못되었거나 잘못된 접근입니다." };
            }
    
            // 토큰 데이터 추출
            const splitArr : string[] = splitOrg.split("#");
            const userIntId: number = Number(splitArr[0]);
            const loginDate: string = splitArr[1];
    
            // 로그인 시간 확인
            if (moment().isAfter(moment(loginDate).add(90, 'minutes'))) {
                return { result: OptionalResult.FAIL, message: `로그인 시간이 만료되었습니다. (Time: ${loginDate})` };
            }
    
            // 사용자 정보 확인
            const findUserResult: Optional<UserInfoEntity> = await this.findUser({id: userIntId});
            if (findUserResult.result == OptionalResult.FAIL) {
                return findUserResult;
            }
    
            // 사용자 세부 정보 확인
            if (findUserResult.result == OptionalResult.SUCCESS) {
                if (!findUserResult.data ||
                     findUserResult.data.role == UserRole.DISABLED ||
                     findUserResult.data.isEmailAuth != 1) {
                    return { result: OptionalResult.FAIL, message: "입력한 토큰에 명시되어 있는 사용자 정보가 없거나 사용할 수 없습니다." };
                }
    
                return findUserResult;
            }
    
            return { result: OptionalResult.FAIL, message: "사용자 정보를 찾는 중 알 수 없는 오류가 발생하였습니다." };
        }catch(error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.checkUserAccountIsAllow.name,
                error: error,
                input: JSON.stringify(defaultAuthInfoDTO),
                moreMessage: "사용자 인증 Token 값을 확인하는 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 사용자 'id'로 사용차를 찾아서 반환
     */
    async checkUserAccountIsAllow(userInfoFindDefaultQuery: UserInfoFindDefaultQuery) : Promise<Optional<string>> {
        const RESULT = {
            DISABLED: "DISABLED",
            NOT_EMAIL_AUTH: "NOT_EMAIL_AUTH",
            SUCCESS: "SUCCESS"
        }

        return this.userInfoRepository.findOneBy({
            id: userInfoFindDefaultQuery.id
        }).then(response => {
            if (response.role == UserRole.DISABLED) {
                return { result: OptionalResult.FAIL, message: "비활성화된 계정입니다.", data: RESULT.DISABLED };
            }

            if (response.isEmailAuth != 1) {
                return { result: OptionalResult.FAIL, message: "이메일 인증이 되어있지 않은 계정입니다.", data: RESULT.NOT_EMAIL_AUTH };
            }

            return { result: OptionalResult.SUCCESS, message: "계정이 정상적으로 확인되었습니다.", data: RESULT.SUCCESS };
        }).catch((error) => {
            let errorLogFormat : ErrorLogFormat = {
                location: this.findUser.name,
                error: error,
                input: JSON.stringify(userInfoFindDefaultQuery),
                moreMessage: "사용자 데이터 검색 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message:errorLogFormat.moreMessage };
        })
    }

    /**
     * 사용자 'id'로 사용차를 찾아서 반환
     */
    async findUser(userInfoFindDefaultQuery: UserInfoFindDefaultQuery) : Promise<Optional<UserInfoEntity>> {
        return this.userInfoRepository.findOneBy({
            id: userInfoFindDefaultQuery.id
        }).then(response => {
            return { result: OptionalResult.SUCCESS, data: response };
        }).catch((error) => {
            let errorLogFormat : ErrorLogFormat = {
                location: this.findUser.name,
                error: error,
                input: JSON.stringify(userInfoFindDefaultQuery),
                moreMessage: "사용자 데이터 검색 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message:errorLogFormat.moreMessage };
        })
    }

    /**
     * 사용자 'id'로 사용차를 찾아서 개수 반환
     */
    async findUserFromIdCount(userInfoFindIdQuery: UserInfoFindIdQuery) : Promise<Optional<number>> {
        return this.userInfoRepository.findAndCountBy({
            userId: userInfoFindIdQuery.userId
        }).then(response => {
            let [userDto, count] = response;

            return { result: OptionalResult.SUCCESS, data: count };
        }).catch((error) => {
            let errorLogFormat : ErrorLogFormat = {
                location: this.findUserFromIdCount.name,
                error: error,
                input: JSON.stringify(userInfoFindIdQuery),
                moreMessage: "사용자 데이터 검색 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        })
    }

    /**
     * 사용자 'userId'로 사용차를 찾아서 반환
     */
    async findUserFromId(userInfoFindIdQuery: UserInfoFindIdQuery) : Promise<Optional<UserInfoEntity>> {
        return this.userInfoRepository.findOneBy({
            userId: userInfoFindIdQuery.userId
        }).then(response => {
            return { result: OptionalResult.SUCCESS, data: response };
        }).catch((error) => {
            let errorLogFormat : ErrorLogFormat = {
                location: this.findUserFromId.name,
                error: error,
                input: JSON.stringify(userInfoFindIdQuery),
                moreMessage: "사용자 데이터 검색 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        })
    }

    /**
     * 사용자 'userId'와 'password'로 사용차를 찾아서 반환
     */
    async findUserFromIdAndPassword(userInfoFindIdAndPasswordQuery: UserInfoFindIdAndPasswordQuery) : Promise<Optional<UserInfoEntity>> {
        return this.userInfoRepository.findOneBy({
            userId: userInfoFindIdAndPasswordQuery.userId
        }).then(response => {
            try {
                const salt : string = response.userHashSalt;
                const sha512Value : string = sha512.crypt(userInfoFindIdAndPasswordQuery.password, salt);
      
                if (response.userPassword == sha512Value) {
                    return { result: OptionalResult.SUCCESS, data: response };
                }else {
                    return { result: OptionalResult.FAIL };
                }
            }catch (error) {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.findUserFromIdAndPassword.name,
                    error: error,
                    input: JSON.stringify(userInfoFindIdAndPasswordQuery),
                    moreMessage: "사용자 데이터 검색 중 오류가 발생하였습니다."
                }
                
                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
                
                return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
            }
        }).catch((error) => {
            let errorLogFormat : ErrorLogFormat = {
                location: this.findUserFromIdAndPassword.name,
                error: error,
                input: JSON.stringify(userInfoFindIdAndPasswordQuery),
                moreMessage: "사용자 데이터 검색 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        })
    }

    /**
     * 사용자 'userId'와 'password'로 사용차를 찾아서 반환 및 암호화된 사용자 ID 반환 (FrontEnd 로그인 전용)
     */
    async findUserFromIdAndPasswordForFrontEndLoginOnly(userInfoFindIdAndPasswordQuery: UserInfoFindIdAndPasswordQuery) : Promise<Optional<UserInfoEncryptEntityForFrontEndLoginOnly>> {
        try {
            let result: Optional<UserInfoEntity> = await this.findUserFromIdAndPassword(userInfoFindIdAndPasswordQuery);
            
            if (result.result == OptionalResult.SUCCESS && result.data) {
                const key: any = process.env.LOGIN_COOKIE_AES_SECRET_KEY;

                if (key) {
                    const date: string = moment().format('YYYY-MM-DD HH:mm:ss');
                    const newEncryptValue: string = await getAesEncryptionValueAsync(`${result.data.id}#${date}`, key);

                    let encValue: Optional<UserInfoEncryptEntityForFrontEndLoginOnly> = {
                        result: OptionalResult.SUCCESS,
                        data: {
                            session: newEncryptValue,
                            id: await getAesEncryptionValueAsync(result.data.id.toString(), key),
                            userId: await getAesEncryptionValueAsync(result.data.userId, key),
                            userPassword: await getAesEncryptionValueAsync(result.data.userPassword, key),
                            userHashSalt: await getAesEncryptionValueAsync(result.data.userHashSalt, key),
                            userName: await getAesEncryptionValueAsync(result.data.userName, key),
                            userEmail: await getAesEncryptionValueAsync(result.data.userEmail, key),
                            userDescription: await getAesEncryptionValueAsync(result.data.userDescription, key),
                            role: result.data.role,
                            isEmailAuth: result.data.isEmailAuth,
                        }
                    }
        
                    return encValue;
                }

                return { result: OptionalResult.FAIL, message: "암호화 키가 존재하지 않습니다." }
            }else {
                if (result.message) {
                    return { result: result.result, message: result.message };
                }else {
                    return { result: result.result };
                }
            }
        }catch(error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.findUserFromIdAndPasswordForFrontEndLoginOnly.name,
                error: error,
                input: JSON.stringify(userInfoFindIdAndPasswordQuery),
                moreMessage: "사용자 데이터 검색 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 사용자 계정 추가
     */
    async addUser(userInfoAddQuery: UserInfoAddQuery) : Promise<Optional<any>> {
        try {
            const count : Optional<number> = await this.findUserFromIdCount({
                userId: userInfoAddQuery.userId
            });

            if (count.result == OptionalResult.SUCCESS && count.data <= 0) {
                const salt : string = getRandomString();
                const passwordShaValue : string = sha512.crypt(userInfoAddQuery.password, salt);

                return await this.userInfoRepository.save({
                    userId: userInfoAddQuery.userId,
                    userPassword: passwordShaValue,
                    userHashSalt: salt,
                    userName: userInfoAddQuery.userName,
                    userEmail: userInfoAddQuery.userEmail,
                    userDescription: userInfoAddQuery.userDescription,
                    role: userInfoAddQuery.userRole
                }).then(() => {
                    return { result: OptionalResult.SUCCESS }
                }).catch((error) => {
                    let errorLogFormat : ErrorLogFormat = {
                        location: this.addUser.name,
                        error: error,
                        input: JSON.stringify(userInfoAddQuery),
                        moreMessage: "사용자 데이터 추가 중 오류가 발생하였습니다."
                    }
                    
                    this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
                    
                    return { result: OptionalResult.FAIL, message: error };
                });
            }else {
                return {  result: OptionalResult.FAIL, message: "해당 아이디를 가진 사용자가 이미 존재하여 생성할 수 없습니다." }
            }
        }catch(error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.addUser.name,
                error: error,
                input: JSON.stringify(userInfoAddQuery),
                moreMessage: "사용자 데이터 추가 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 사용자 계정 추가 (default user only)
     */
    async addUserDefault(userInfoAddQuery: UserInfoAddQuery) : Promise<Optional<any>> {
        if (userInfoAddQuery.userRole == UserRole.ADMIN)
            return { result: OptionalResult.FAIL, message: "사용자 권한이 'ADMIN'인 사용자는 추가할 수 없습니다." };
        else if (userInfoAddQuery.userRole == UserRole.DISABLED)
            return { result: OptionalResult.FAIL, message: "사용자 권한이 'DISABLED'인 사용자는 추가할 수 없습니다." };
        else
            return this.addUser(userInfoAddQuery);
    }

    /**
     * 사용자 계정 수정
     */
    async updateUser(userInfoUpdateQuery: UserInfoUpdateQuery) : Promise<Optional<any>> {
        try {
            const findResult: Optional<UserInfoEntity> = await this.findUser({
                id: userInfoUpdateQuery.id
            });

            if (findResult.result == OptionalResult.SUCCESS) {
                if (findResult.data.isEmailAuth != 1) {
                    return { result: OptionalResult.FAIL, message: "해당 사용자가 아직 이메일 인증을 완료하지 않았습니다." };
                }

                return await this.userInfoRepository.update({
                    id: userInfoUpdateQuery.id
                },userInfoUpdateQuery.userInfo)
                .catch((error) => {
                    let errorLogFormat : ErrorLogFormat = {
                        location: this.updateUser.name,
                        error: error,
                        input: JSON.stringify(userInfoUpdateQuery),
                        moreMessage: "사용자 데이터 수정 중 오류가 발생하였습니다."
                    }
                    
                    this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
                    
                    return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
                }).then(() => {
                    return { result: OptionalResult.SUCCESS }
                });
            }else {
                return { result: OptionalResult.FAIL, message: "해당 'id'를 가진 사용자를 찾을 수 없습니다." };
            }
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.updateUser.name,
                error: error,
                input: JSON.stringify(userInfoUpdateQuery),
                moreMessage: "사용자 데이터 수정 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 사용자 계정 수정 [FrontEnd 전용]
     */
    async updateUserForFrontend(userUpdateForFrontendQuery: UserUpdateForFrontendQuery) : Promise<Optional<any>> {
        try {
            const findResult: Optional<UserInfoEntity> = await this.findUser({
                id: userUpdateForFrontendQuery.id
            });

            const findTokenResult: Optional<UserInfoEntity> = await this.checkUserAccountIsAllowForToken({ token: userUpdateForFrontendQuery.token });
            if (findTokenResult.result == OptionalResult.FAIL) {
                return findTokenResult;
            }
            if (findTokenResult.data.id != userUpdateForFrontendQuery.id || findTokenResult.data.userId != userUpdateForFrontendQuery.userId) {
                return { result: OptionalResult.FAIL, message: "변경을 요청한 사용자와 인증 토큰에 저장된 사용자 정보가 일치하지 않습니다." };
            }

            if (userUpdateForFrontendQuery.userInfo.id ||
                userUpdateForFrontendQuery.userInfo.userId ||
                userUpdateForFrontendQuery.userInfo.userPassword ||
                userUpdateForFrontendQuery.userInfo.userHashSalt ||
                userUpdateForFrontendQuery.userInfo.role ||
                userUpdateForFrontendQuery.userInfo.isEmailAuth ||
                userUpdateForFrontendQuery.userInfo.userEmail ||
                userUpdateForFrontendQuery.userInfo.userDescription) {
                return { result: OptionalResult.FAIL, message: "수정할 수 없는 데이터가 포함되어 있습니다." };
            }

            if (!userUpdateForFrontendQuery.userInfo.userName) {
                return { result: OptionalResult.FAIL, message: "수정할 데이터가 적어도 1개 이상이어야 합니다." };
            }

            if (!(userUpdateForFrontendQuery.userInfo.userName.length >= 2 && userUpdateForFrontendQuery.userInfo.userName.length <= 40)) {
                return { result: OptionalResult.FAIL, message: "사용자 이름은 2자 이상 40자 이하로 입력해야 합니다." };
            }

            if (findResult.result == OptionalResult.SUCCESS) {
                if (findResult.data.isEmailAuth != 1) {
                    return { result: OptionalResult.FAIL, message: "해당 사용자가 아직 이메일 인증을 완료하지 않았습니다." };
                }

                return await this.userInfoRepository.update({
                    id: userUpdateForFrontendQuery.id
                },userUpdateForFrontendQuery.userInfo)
                .catch((error) => {
                    let errorLogFormat : ErrorLogFormat = {
                        location: this.updateUser.name,
                        error: error,
                        input: JSON.stringify(userUpdateForFrontendQuery),
                        moreMessage: "사용자 데이터 수정 중 오류가 발생하였습니다."
                    }
                    
                    this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
                    
                    return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
                }).then(() => {
                    return { result: OptionalResult.SUCCESS }
                });
            }else {
                return { result: OptionalResult.FAIL, message: "해당 'id'를 가진 사용자를 찾을 수 없습니다." };
            }
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.updateUser.name,
                error: error,
                input: JSON.stringify(userUpdateForFrontendQuery),
                moreMessage: "사용자 데이터 수정 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 사용자 계정 수정 [비밀번호 FrontEnd 전용]
     */
    async updateUserPasswordForFrontend(userUpdatePasswordForFrontendQuery : UserUpdatePasswordForFrontendQuery) : Promise<Optional<any>> {
        try {
            const findResult: Optional<UserInfoEntity> = await this.findUserFromIdAndPassword({
                userId: userUpdatePasswordForFrontendQuery.userId,
                password: userUpdatePasswordForFrontendQuery.password
            });

            if (findResult.result == OptionalResult.SUCCESS) {
                if (findResult.data.isEmailAuth != 1) {
                    return { result: OptionalResult.FAIL, message: "해당 사용자가 아직 이메일 인증을 완료하지 않았습니다." };
                }
                
                const passwordShaValue : string = sha512.crypt(userUpdatePasswordForFrontendQuery.newPassword, findResult.data.userHashSalt);

                return await this.userInfoRepository.update({
                    id: findResult.data.id,
                },{userPassword: passwordShaValue})
                .catch((error) => {
                    let errorLogFormat : ErrorLogFormat = {
                        location: this.updateUser.name,
                        error: error,
                        input: JSON.stringify(userUpdatePasswordForFrontendQuery),
                        moreMessage: "사용자 비밀번호 변경 작업 중 오류가 발생하였습니다."
                    }
                    
                    this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
                    
                    return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
                }).then(() => {
                    return { result: OptionalResult.SUCCESS }
                });
            }else {
                return { result: OptionalResult.FAIL, message: "해당 'id'를 가진 사용자를 찾을 수 없습니다." };
            }
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.updateUser.name,
                error: error,
                input: JSON.stringify(userUpdatePasswordForFrontendQuery),
                moreMessage: "사용자 비밀번호 변경 작업 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 사용자 계정 제거
     */
    async removeUser(userInfoRemoveQuery: UserInfoRemoveQuery) : Promise<Optional<any>> {
        return await this.userInfoRepository.delete({
            id: userInfoRemoveQuery.id,
        }).catch((error) => {
            let errorLogFormat : ErrorLogFormat = {
                location: this.removeUser.name,
                error: error,
                input: JSON.stringify(userInfoRemoveQuery),
                moreMessage: "사용자 데이터 제거 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }).then(() => {
            return { result: OptionalResult.SUCCESS }
        });
    }
    
    /**
     * 사용자 계정 이메일 인증 코드 전송
     */
    async sendSignupAuthCodeEmail(userInfoFindDefaultQuery : UserInfoFindDefaultQuery) : Promise<Optional<EmailAuthCodeSendResult>> {
        try {
            const userInfo : Optional<UserInfoEntity> = await this.findUser(userInfoFindDefaultQuery)

            if (userInfo.result != OptionalResult.SUCCESS || !userInfo.data) {
                return { result: OptionalResult.FAIL, message: "해당 유저 정보가 존재하지 않아 인증코드를 전송할 수 없습니다." }
            }
            
            return await this.mailService.sendAuthCode({
                id: userInfo.data.id,
                userId: userInfo.data.userId,
                target: userInfo.data.userEmail,
                authType: EmailAuthType.SIGNUP,
            });    
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.sendSignupAuthCodeEmail.name,
                error: error,
                input: JSON.stringify(userInfoFindDefaultQuery),
                moreMessage: "사용자 이메일 인증 코드 발송 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }

    /**
     * 사용자 계정 이메일 인증 코드 확인
     */
    async checkUserEmailAuthCode(userEmailAuthCodeQuery: UserEmailAuthCodeQuery) : Promise<Optional<any>> {
        try {
            // 회원가입 인증 코드 확인
            if (userEmailAuthCodeQuery.type == EmailAuthType.SIGNUP) {
                return await this.accountEmailAuthInfoRepository.findOneBy({
                    id: userEmailAuthCodeQuery.id,
                    requestCode: userEmailAuthCodeQuery.requestCode,
                    verifyCode: userEmailAuthCodeQuery.code,
                    authType: userEmailAuthCodeQuery.type
                }).catch((error) => {
                    let errorLogFormat : ErrorLogFormat = {
                        location: this.checkUserEmailAuthCode.name,
                        error: error,
                        input: JSON.stringify(userEmailAuthCodeQuery),
                        moreMessage: "사용자 이메일 인증 데이터 조회 중 오류가 발생하였습니다."
                    }
                    
                    this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
                    
                    return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
                }).then(async (result : AccountEmailAuthEntity) => {
                    if (!(result && 
                        result.id == userEmailAuthCodeQuery.id && 
                        result.requestCode == userEmailAuthCodeQuery.requestCode)) {

                        return { result: OptionalResult.FAIL, message: "입력한 인증정보를 찾을 수 없습니다." };
                    }
                    
                    await this.accountEmailAuthInfoRepository.delete({
                        id: result.id,
                        authType: result.authType
                    }).catch((error) => {
                        let errorLogFormat : ErrorLogFormat = {
                            location: this.checkUserEmailAuthCode.name,
                            error: error,
                            input: JSON.stringify(userEmailAuthCodeQuery),
                            moreMessage: "사용자 이메일 인증 데이터 조회 완료 후 삭제 중 오류가 발생하였습니다."
                        }
                        
                        this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

                        return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
                    });

                    await this.userInfoRepository.update({
                        id: result.id
                    }, {
                        isEmailAuth: 1
                    }).catch((error) => {
                        let errorLogFormat : ErrorLogFormat = {
                            location: this.checkUserEmailAuthCode.name,
                            error: error,
                            input: JSON.stringify(userEmailAuthCodeQuery),
                            moreMessage: "사용자 이메일 인증 데이터 조회 완료 후 사용자 데이터 수정 중 오류가 발생하였습니다."
                        }

                        this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

                        return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
                    });

                    return { result: OptionalResult.SUCCESS };
                });
            }

            return { result: OptionalResult.SUCCESS, data: false, message: "지원하지 않는 인증 형식입니다." };
        }catch (error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.checkUserEmailAuthCode.name,
                error: error,
                input: JSON.stringify(userEmailAuthCodeQuery),
                moreMessage: "사용자 이메일 인증 데이터 수정 중 오류가 발생하였습니다."
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
            
            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }
}
