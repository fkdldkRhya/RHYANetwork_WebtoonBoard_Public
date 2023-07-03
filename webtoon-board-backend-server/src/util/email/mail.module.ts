import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MyLoggerModule } from '../logger/my-logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEmailAuthEntity } from './entities/mail-auth.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEmailAuthEntity]),
    
    ConfigModule.forRoot({
        envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev'
    }),
    
    MyLoggerModule,
    MailerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            transport: {
                host: configService.get("ROOT_EMAIL_SMTP_SERVER_HOST"),
                port: configService.get("ROOT_EMAIL_SMTP_SERVER_PORT"),
                auth: {
                    user: configService.get("ROOT_EMAIL_ACCOUNT_ID"),
                    pass: configService.get("ROOT_EMAIL_ACCOUNT_PASSWORD"),
                },
            },
        })
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}