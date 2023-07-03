import { Module } from '@nestjs/common';
import { NaverWebtoonController } from './naver-webtoon.controller';
import { NaverWebtoonService } from './naver-webtoon.service';
import { HttpModule } from '@nestjs/axios';
import { MyLoggerModule } from '../util/logger/my-logger.module';
import { WebtoonInfoModule } from 'src/webtoon-info/webtoon-info.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    WebtoonInfoModule,
    UserModule,
    MyLoggerModule,
    HttpModule
  ],
  controllers: [NaverWebtoonController],
  providers: [NaverWebtoonService],
  exports: [NaverWebtoonService]
})
export class NaverWebtoonModule {}
