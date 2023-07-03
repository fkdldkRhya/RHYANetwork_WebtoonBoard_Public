import { ConsoleLogger, LogLevel } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MyLoggerEntity } from "./entities/my-logger.entity";

export interface LoggerService {
    log(message: any, ...optionalParams: any[]): any;
    error(message: any, ...optionalParams: any[]): any;
    warn(message: any, ...optionalParams: any[]): any;
    debug?(message: any, ...optionalParams: any[]): any;
    verbose?(message: any, ...optionalParams: any[]): any;
    setLogLevels?(levels: LogLevel[]): any;
}

export class MyLogger extends ConsoleLogger {
    constructor(
        @InjectRepository(MyLoggerEntity) private logRepository: Repository<MyLoggerEntity>,
    ) {
        super();
        
        this.logRepository = logRepository;
    }

    log(message: any, context: string) {
        super.setContext(context);
        super.log.apply(this, arguments);
        this.doSomething("LOG", message, context);
    }

    warn(message: any, context: string) {
        super.setContext(context);
        super.warn.apply(this, arguments);
        this.doSomething("WARN", message, context);
    }

    debug(message: any, context: string) {
        super.setContext(context);
        super.debug.apply(this, arguments);
        this.doSomething("DEBUG", message, context);
    }

    verbose(message: any, context: string) {
        super.setContext(context);
        super.verbose.apply(this, arguments);
        this.doSomething("VERBOSE", message, context);
    }
    
    error(message: any, context: string) {
        super.setContext(context);
        super.error.apply(this, arguments);
        this.doSomething("ERROR", message, context);
    }

    /**
     * 로그 저장
     */
    private async doSomething(service: any, message: any, context: string) {
        // 로그 생성
        await this.logRepository.save({
            level: service,
            logger: context,
            message: message
        }).catch(() => {});
    }
}