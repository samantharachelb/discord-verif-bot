const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, printf, colorize } = format;
import moment from 'moment';
import path from 'path';
import CloudStorage from '@src/core/cloud/CloudStorage';


export abstract class Log {
    static logger = createLogger({
        format: combine(
            format((info: any) => {
                info.level = info.level.toUpperCase();
                return info
            })(),
            printf((info: any) => {
                return `${moment().format('YYYY-MM-DD THH:mm:ss.SSSZZ')} [${info.level}]: ${info.message}`;
            })
        ),
        transports: [
            new transports.Console({
                level: 'debug',
                format: combine(
                    format((info: any) => {
                        info.level = info.level.toUpperCase();
                        return info
                    })(),
                    colorize(),
                    printf((info: any) => {
                        return `${moment().format('YYYY-MM-DD THH:mm:ss.SSSZZ')} [${info.level}]: ${info.message}`;
                    })
                )
            })
        ],
        exitOnError: true
    })

    static rotateLogs(oldFilename: string): void {
        const filePath = path.join(process.cwd(), oldFilename);
        CloudStorage.uploadFile(filePath)
            .catch((err: Error) => {
                this.logger.warn(err.toString())
            })
    }
}
