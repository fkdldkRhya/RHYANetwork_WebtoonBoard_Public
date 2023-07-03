import { Module } from '@nestjs/common';
import { MyLoggerModule } from '../util/logger/my-logger.module';
import { ElasticsearchService } from './elasticsearch.service';
import { ElasticsearchController } from './elasticsearch.controller';


@Module({
  imports: [
    MyLoggerModule,
  ],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
  controllers: [ElasticsearchController]
})
export class ElasticsearchModule {}
