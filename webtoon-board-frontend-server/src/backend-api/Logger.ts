import winston, { createLogger, transports, format } from 'winston';

export function getLogger() : winston.Logger {
    return createLogger({
        transports: [
          new transports.Console({
            format: format.combine(
              format.label({ label: '[WebtoonBoard-FE]' }),
              format.timestamp({
                format: 'YYYY-MM-DDThh:mm:ss.s'
              }),
              format.colorize(),
              format.printf((info) => {
               return `[${info.timestamp} ${info.level}]: ${info.label}   ${info.message}`; 
              })
            )
          })
        ]
    });
}