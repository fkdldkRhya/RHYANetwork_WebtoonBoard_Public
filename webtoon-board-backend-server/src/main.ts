import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

import { GlobalExceptionFilter } from './util/exception/global-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, 
    {
      cors: true,
      abortOnError: true
    }
  );
  
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    optionsSuccessStatus: 200,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: false,
      /*exceptionFactory(errors) {
        console.log(errors);
      },*/
    }),
  );
  
  await app.listen(3000);
}

'use strict';
bootstrap();
