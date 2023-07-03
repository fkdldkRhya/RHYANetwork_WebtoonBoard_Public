import { Module } from '@nestjs/common';
import { WebtoonInfoService } from './webtoon-info.service';
import { MyLoggerModule } from 'src/util/logger/my-logger.module';
import { NaverWebtoonModule } from 'src/naver-webtoon/naver-webtoon.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebtoonInfoEntity } from './entities/webtoon-info.entity';
import { WebtoonRequestInfoEntity } from './entities/webtoon-request-info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebtoonInfoEntity, WebtoonRequestInfoEntity]),
    MyLoggerModule
  ],
  providers: [WebtoonInfoService],
  exports: [WebtoonInfoService]
})
export class WebtoonInfoModule {}