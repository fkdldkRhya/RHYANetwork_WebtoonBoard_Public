import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalExceptionFilter } from './util/exception/global-exception-filter';
import { Middleware } from './util/middlewares/middleware';
import { MyLoggerModule } from './util/logger/my-logger.module';
import { MyLoggerEntity } from './util/logger/entities/my-logger.entity';
import { WebtoonInfoEntity } from './webtoon-info/entities/webtoon-info.entity';
import { UserInfoEntity } from './user/entities/user-info.entity';

// =========================
// WebtoonBoard Pages module
// =========================
import { NaverWebtoonModule } from './naver-webtoon/naver-webtoon.module';
import { WebtoonInfoModule } from './webtoon-info/webtoon-info.module';
import { UserModule } from './user/user.module';
import { MailModule } from './util/email/mail.module';
import { AccountEmailAuthEntity } from './util/email/entities/mail-auth.entities';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { LoginUserTaskModule } from './login-user-task/login-user-task.module';
import { RuleBasedControllerAccessDetailInfoEntity } from './login-user-task/entities/rule-based-controller-info.entity';
import { CommentWordFrequencyInfoEntity } from './comment-word-frequency/entities/comment-word-frequency-info.entity';
import { CommentWordFrequencyModule } from './comment-word-frequency/comment-word-frequency.module';
import { WebtoonRequestInfoEntity } from './webtoon-info/entities/webtoon-request-info.entity';
// =========================
// =========================

@Module({
    imports:[
        ConfigModule.forRoot({
            envFilePath: process.env.NODE_ENV_BACKEND === 'prod' ? '.env.prod' : '.env.dev'
        }),

        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                timeout: configService.get('HTTP_TIMEOUT'),
                maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
            }),
        }),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: 'mysql',
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USERNAME'),
                    password: configService.get('DATABASE_PASSWORD'),
                    database: configService.get('DATABASE_NAME'),
                    entities: [
                        MyLoggerEntity,
                        WebtoonInfoEntity,
                        UserInfoEntity,
                        AccountEmailAuthEntity,
                        RuleBasedControllerAccessDetailInfoEntity,
                        CommentWordFrequencyInfoEntity,
                        WebtoonRequestInfoEntity,
                    ],
                    synchronize: false,
                    logging: false
                };
            },
        }),

        // =========================
        // WebtoonBoard Pages module
        // =========================
        MyLoggerModule,
        MailModule,
        NaverWebtoonModule,
        WebtoonInfoModule,
        UserModule,
        ElasticsearchModule,
        LoginUserTaskModule,
        CommentWordFrequencyModule,
        // =========================
        // =========================
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
        AppService
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(Middleware).forRoutes('*');
    }
}
