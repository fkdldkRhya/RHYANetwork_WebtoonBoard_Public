import { Module } from '@nestjs/common';
import { LoginUserTaskService } from './login-user-task.service';
import { LoginUserTaskController } from './login-user-task.controller';
import { MyLoggerModule } from 'src/util/logger/my-logger.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuleBasedControllerAccessDetailInfoEntity } from './entities/rule-based-controller-info.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([RuleBasedControllerAccessDetailInfoEntity]),
    MyLoggerModule,
    UserModule,
    HttpModule,
  ],
  providers: [LoginUserTaskService],
  controllers: [LoginUserTaskController],
  exports: [LoginUserTaskService]
})
export class LoginUserTaskModule {}
