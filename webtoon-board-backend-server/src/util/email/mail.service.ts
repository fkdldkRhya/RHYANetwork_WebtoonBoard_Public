import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { ErrorLogFormat, getErrorMessage } from '../dto/error-log-format.service.dto';
import { EmailSendData } from './dto/mail-send-data.dto';
import { getEmailAuthCodeTemplate } from './util/email-auth-code.template';
import { Optional, OptionalResult } from '../dto/optional.dto';
import { EmailAuthCodeSendResult } from './dto/auth-code-result.dto';
import { generate } from "randomstring";
import { AccountEmailAuthEntity } from './entities/mail-auth.entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MailService {
  // -----------------------------------------
  // Logger setting
  // -----------------------------------------
  private readonly LOGGER_CONTEXT_NAME: string = MailService.name;
  // -----------------------------------------

  constructor(
    @InjectRepository(AccountEmailAuthEntity) private readonly accountEmailAuthInfoRepository: Repository<AccountEmailAuthEntity>,
    private readonly mailerService: MailerService,
    private readonly logger: MyLogger
  ) {}

  async sendAuthCode(data: EmailSendData) : Promise<Optional<EmailAuthCodeSendResult>> {
    const code : number = generate({length: 6, charset: 'numeric'});
    const requestCode = generate(128);
    const mailTitle : string = ` ${data.userId} 님! Webtoonboard 이메일 인증코드가 도착하였습니다.`;
    const make_html : string = getEmailAuthCodeTemplate(data.userId, code.toString());

    return await this.mailerService.sendMail({
      to: data.target,
      subject: mailTitle,
      html: make_html,
    }).then(async () => {
      await this.accountEmailAuthInfoRepository.delete({
        id: data.id,
        authType: data.authType
      }).catch();

      return await this.accountEmailAuthInfoRepository.save({
        id: data.id,
        authType: data.authType,
        requestCode: requestCode,
        verifyCode: code
      }).then(()=> {
        return { 
          result: OptionalResult.SUCCESS,
          data: {
            code: code,
            requestCode: requestCode
          }
        };
      }).catch((error) => {
        let errorLogFormat : ErrorLogFormat = {
          location: this.sendAuthCode.name,
          error: error,
          input: JSON.stringify(data),
          moreMessage: "인증코드 이메일 데이터 생성 중 오류가 발생했습니다."
        }
  
        this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);
  
        return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
      });
    }).catch((error) => {
      let errorLogFormat : ErrorLogFormat = {
        location: this.sendAuthCode.name,
        error: error,
        input: JSON.stringify(data),
        moreMessage: "인증코드 이메일 전송 중 오류가 발생했습니다."
      }

      this.logger.error(getErrorMessage(errorLogFormat), this.LOGGER_CONTEXT_NAME);

      return { result: OptionalResult.FAIL, message: errorLogFormat.moreMessage };
    });
  }
}