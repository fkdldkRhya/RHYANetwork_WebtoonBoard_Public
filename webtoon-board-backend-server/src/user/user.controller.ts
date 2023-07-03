import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserInfoAddQuery } from './dto/user-info-add.dto';
import { UserService } from './user.service';
import { Optional, OptionalResult } from 'src/util/dto/optional.dto';
import { UserInfoRemoveQuery } from './dto/user-info-remove.dto';
import { UserInfoFindDefaultQuery } from './dto/user-info-find-default.dto';
import { UserInfoEncryptEntityForFrontEndLoginOnly, UserInfoEntity } from './entities/user-info.entity';
import { UserInfoFindIdAndPasswordQuery } from './dto/user-info-find-id-and-password.dto';
import { UserInfoUpdateQuery } from './dto/user-info-update.dto';
import { EmailAuthCodeSendResult } from 'src/util/email/dto/auth-code-result.dto';
import { UserEmailAuthCodeQuery } from './dto/user-email-auth-code.dto';
import { UserUpdatePasswordForFrontendQuery } from './dto/user-update-password-for-frontend.dto';
import { UserUpdateForFrontendQuery } from './dto/user-update-for-frontend.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}
    
    @Get("send-sign-up-auth-code")
    async sendSignupAuthCodeEmail(@Query() userInfoFindDefaultQuery : UserInfoFindDefaultQuery) : Promise<Optional<EmailAuthCodeSendResult>> {
        return await this.userService.sendSignupAuthCodeEmail(userInfoFindDefaultQuery);
    }

    @Get("check-user-account-is-allow")
    async checkUserAccountIsAllow(@Query() userInfoFindDefaultQuery : UserInfoFindDefaultQuery) : Promise<Optional<string>> {
        return await this.userService.checkUserAccountIsAllow(userInfoFindDefaultQuery);
    }

    @Get("find")
    async findUser(@Query() userInfoFindDefaultQuery : UserInfoFindDefaultQuery) : Promise<Optional<UserInfoEntity>> {
        return await this.userService.findUser(userInfoFindDefaultQuery);
    }

    @Post("find-id-and-password")
    async loginUser(@Body() userInfoFindIdAndPasswordQuery : UserInfoFindIdAndPasswordQuery) : Promise<Optional<UserInfoEntity>> {
        return await this.userService.findUserFromIdAndPassword(userInfoFindIdAndPasswordQuery);
    }

    @Post("find-id-and-password-for-frontend-login-only")
    async loginUserEnc(@Body() userInfoFindIdAndPasswordQuery : UserInfoFindIdAndPasswordQuery) : Promise<Optional<UserInfoEncryptEntityForFrontEndLoginOnly>> {
        return await this.userService.findUserFromIdAndPasswordForFrontEndLoginOnly(userInfoFindIdAndPasswordQuery);
    }

    @Post("add-default")
    async addUser(@Body() userInfoAddQuery : UserInfoAddQuery) : Promise<Optional<any>> {
        return await this.userService.addUserDefault(userInfoAddQuery);
    }

    @Post("add-admin")
    async addUserForAdmin(@Body() userInfoAddQuery : UserInfoAddQuery) : Promise<Optional<any>> {
        return await this.userService.addUser(userInfoAddQuery);
    }

    @Post("update")
    async updatenUser(@Body() userInfoUpdateQuery : UserInfoUpdateQuery) : Promise<Optional<any>> {
        return await this.userService.updateUser(userInfoUpdateQuery);
    }

    @Post("update-for-frontend-only")
    async updateFrontendOnly(@Body() userUpdateForFrontendQuery : UserUpdateForFrontendQuery) : Promise<Optional<any>> {
        return await this.userService.updateUserForFrontend(userUpdateForFrontendQuery);
    }

    @Post("update-password-for-frontend-only")
    async updateUserPasswordFrontendOnly(@Body() userUpdatePasswordForFrontendQuery : UserUpdatePasswordForFrontendQuery) : Promise<Optional<any>> {
        return await this.userService.updateUserPasswordForFrontend(userUpdatePasswordForFrontendQuery);
    }

    @Get("remove")
    async removeUser(@Query() userInfoRemoveQuery : UserInfoRemoveQuery) : Promise<Optional<any>> {
        return await this.userService.removeUser(userInfoRemoveQuery);
    }

    @Get("email-auth-code-check")
    async checkUserEmailAuthCode(@Query() userEmailAuthCodeQuery: UserEmailAuthCodeQuery) : Promise<Optional<any>> {
        return await this.userService.checkUserEmailAuthCode(userEmailAuthCodeQuery);
    }
}
