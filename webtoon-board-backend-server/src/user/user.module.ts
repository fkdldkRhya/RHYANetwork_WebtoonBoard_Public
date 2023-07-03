import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyLoggerModule } from 'src/util/logger/my-logger.module';
import { UserInfoEntity } from './entities/user-info.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailModule } from 'src/util/email/mail.module';
import { AccountEmailAuthEntity } from 'src/util/email/entities/mail-auth.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfoEntity, AccountEmailAuthEntity]),
    MyLoggerModule,
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
