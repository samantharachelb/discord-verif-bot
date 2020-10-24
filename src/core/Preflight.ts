const winston = require('winston');
const { transports } = winston;
const logger = require('@src/core/logging');
require('winston-daily-rotate-file');
import fs from "fs";
import path from 'path';
import forceExit from "@src/core/forceExit";

export abstract class Preflight {
    static logDirectory = path.join(process.cwd(), 'logs/');

    static logFiles() {
        const logFileTransport = new transports.DailyRotateFile({
            filename: 'verifbot-%DATE%.log',
            datePattern: 'YYYY-MM-DD THH:mm:ss.SSSZZ',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d'
        });

        logFileTransport.on('rotate', function(oldFilename: string, newFilename: string) {

        });

        logger.add(logFileTransport);
    }

}
