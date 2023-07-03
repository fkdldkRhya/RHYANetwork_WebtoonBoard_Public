import { Injectable } from '@nestjs/common';
import { UserInfoEntity, UserRole } from 'src/user/entities/user-info.entity';
import { UserService } from 'src/user/user.service';
import { MyLogger } from 'src/util/logger/my-logger.service';
import { DefaultAuthInfoDTO } from './dto/auth-info-default.dto';
import { getAesDecryptionValueAsync } from 'src/util/crypto/aes.crypto';
import { Optional, OptionalResult } from 'src/util/dto/optional.dto';
import * as moment from 'moment';
import { ErrorLogFormat, getErrorMessage } from 'src/util/dto/error-log-format.service.dto';
import { RuleBasedControllerLinkerQuery } from './dto/rule-based-controller-linker.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuleBasedControllerAccessDetailInfoEntity } from './entities/rule-based-controller-info.entity';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LoginUserTaskService {
    // -----------------------------------------
    // Logger setting
    // -----------------------------------------
    private readonly LOGGER_CONTEXT_NAME: string = LoginUserTaskService.name;
    // -----------------------------------------

    constructor(
        @InjectRepository(RuleBasedControllerAccessDetailInfoEntity) private readonly ruleBasedControllerAccessDetailInfoRepository: Repository<RuleBasedControllerAccessDetailInfoEntity>,
        private readonly httpService: HttpService,
        private readonly logger: MyLogger,
        private readonly userService: UserService,
    ) { }

    async ruleBasedControllerLinker(ruleBasedControllerLinkerQuery: RuleBasedControllerLinkerQuery) : Promise<Optional<any>> {
        try {
            // 로그인 확인
            const checkUserAccountIsAllowResult: Optional<UserInfoEntity> = await this.userService.checkUserAccountIsAllowForToken(
                ruleBasedControllerLinkerQuery.defaultAuthInfoDTO
            );

            // 로그인 성공 여부 확인
            if (checkUserAccountIsAllowResult.result != OptionalResult.SUCCESS) {
                return checkUserAccountIsAllowResult;
            }

            // 컨트롤러 정보 확인
            return await this.ruleBasedControllerAccessDetailInfoRepository.findOneBy({
                path: ruleBasedControllerLinkerQuery.path
            }).then(async (result) => {
                try {
                    let exit : boolean = false;

                    // 권한 비교
                    switch (result.rule) {
                        case UserRole.ADMIN:
                            exit = checkUserAccountIsAllowResult.data.role != UserRole.ADMIN
                            
                            break;

                        case UserRole.DEFAULT:
                            exit = false;

                            break;
                        
                        case UserRole.DISABLED:
                            exit = true;
                    }

                    // 권한이 없는 경우
                    if (exit)
                        return { result: OptionalResult.FAIL, message: "해당 경로에 관한 접근이 차단되어있습니다. 관리자에게 문의하여 주십시오." };

                    // 컨트롤러 경로 접속
                    const host : string = ((process.env.NODE_ENV_BACKEND) ? (process.env.NODE_ENV_BACKEND as string) : "").toLocaleLowerCase() === "dev" ?
                     "http://127.0.0.1:3000" :
                     "https://webtoon-board-api.rhya-network.kro.kr"
                    let requestQuery : any = {
                        url: result.isUseParm == 1 ? 
                        `${host}/${ruleBasedControllerLinkerQuery.path}?${ruleBasedControllerLinkerQuery.parm}` :
                        `${host}/${ruleBasedControllerLinkerQuery.path}`,
                        method: result.method,
                        headers:{
                            Authorization: process.env.BACKEND_API_ACCESS_KEY,
                        },
                        data: ruleBasedControllerLinkerQuery.body,
                        responseType: 'json',   
                    };

                    // GET 메소드인 경우 또는 입력값이 Null인 경우 body 제거
                    if (result.method == "GET" || !ruleBasedControllerLinkerQuery.body)
                        delete requestQuery.data;

                    // 접속 결과 반환
                    let response : AxiosResponse<any, any> = await this.httpService.axiosRef(requestQuery);
                    return { result: OptionalResult.SUCCESS, data: response.data };
                }catch(error) {
                    let errorLogFormat : ErrorLogFormat = {
                        location: this.ruleBasedControllerLinker.name,
                        error: error,
                        input: JSON.stringify(ruleBasedControllerLinkerQuery),
                        moreMessage: "역할 기반 컨트롤러 연결 관리자가 작업 처리 중 오류가 발생하였습니다.",
                    }
                    
                    this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
        
                    return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
                }
            }).catch((error) => {
                let errorLogFormat : ErrorLogFormat = {
                    location: this.ruleBasedControllerLinker.name,
                    error: error,
                    input: JSON.stringify(ruleBasedControllerLinkerQuery),
                    moreMessage: "역할 기반 컨트롤러 연결 관리자가 역할 정보 처리 중 오류가 발생하였습니다.",
                }
                
                this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
    
                return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
            })
        }catch(error) {
            let errorLogFormat : ErrorLogFormat = {
                location: this.ruleBasedControllerLinker.name,
                error: error,
                input: JSON.stringify(ruleBasedControllerLinkerQuery),
                moreMessage: "역할 기반 컨트롤러 연결 관리자가 작업 처리 중 오류가 발생하였습니다.",
            }
            
            this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

            return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
        }
    }
}
