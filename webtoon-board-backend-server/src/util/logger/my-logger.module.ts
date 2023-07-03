import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyLoggerEntity } from './entities/my-logger.entity';
import { MyLogger } from './my-logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MyLoggerEntity])
  ],
  providers: [MyLogger],
  exports: [MyLogger],
})
export class MyLoggerModule { }