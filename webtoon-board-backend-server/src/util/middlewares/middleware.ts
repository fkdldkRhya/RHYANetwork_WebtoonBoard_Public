import {  HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLogger } from '../logger/my-logger.service';

@Injectable()
export class Middleware implements NestMiddleware {
  constructor(private readonly logger: MyLogger) {}
  
  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Request 데이터
      const { ip, method, originalUrl, headers, baseUrl } = req;

      // Authorization 헤더 데이터
      const inputApiKey : any = headers.authorization;

      // Stop key 확인
      const stopKey = process.env.SERVER_STOP_KEY;

      if (inputApiKey == stopKey) {
        process.exit(0);
      }

      // API Key 필요 유무 확인
      const urls: string[] = process.env.ALLOWED_NO_AUTHORIZATION_HEADER_URLS.split(",");
      // API Key 필요 없는 URL이면 API Key 체크 생략
      if (!urls.includes(baseUrl.toLowerCase()) && process.env.ALLOWED_NO_AUTHORIZATION_HEADER_CHECK_URL.toLocaleLowerCase() == "true") {
        // ===================================
        // Login user 전용 페이지 접근 체크
        // ===================================
        if (!(
          baseUrl.toString().includes("/") &&
          baseUrl.toString().toLocaleLowerCase().split("/").length >= 2 &&
          baseUrl.toString().toLocaleLowerCase().split("/")[1] == "login-user-task"
        )) {
          // API Key 설정 확인
          // ===================================
          if (inputApiKey != process.env.BACKEND_API_ACCESS_KEY) {
            res.status(HttpStatus.UNAUTHORIZED).json({
              status: HttpStatus.UNAUTHORIZED,
              message: "Webtoonboard API 접근 거부! 허용되지 않은 접근 입니다."
            });
    
            return;
          }
          // ===================================
        }
      }

      // 필수 헤더 설정
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      res.setHeader('X-Frame-Options', 'DENY');

      // 로그 출력 설정
      res.on('finish', () => {
        const { statusCode } = res;
        this.logger.log(`${method} ${originalUrl} ${statusCode} ${ip}`, Middleware.name);
      });

      // 다음 작업 진행
      next();
    }catch(error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: "Webtoonboard API 접근 거부! 알 수 없는 오류가 발생했습니다."
      });
    }
  }
}


