import { Module } from '@nestjs/common';
import { CommentWordFrequencyService } from './comment-word-frequency.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyLoggerModule } from 'src/util/logger/my-logger.module';
import { CommentWordFrequencyInfoEntity } from './entities/comment-word-frequency-info.entity';
import { CommentWordFrequencyController } from './comment-word-frequency.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentWordFrequencyInfoEntity]),
    MyLoggerModule,
  ],
  providers: [CommentWordFrequencyService],
  exports: [CommentWordFrequencyService],
  controllers: [CommentWordFrequencyController]
})
export class CommentWordFrequencyModule {}
