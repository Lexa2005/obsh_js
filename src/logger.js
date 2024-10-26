const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = 'obshlogs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'DD.MM.YYYY, HH:mm:ss' }),
        winston.format.printf(({ timestamp, message }) => {
            return `[${timestamp}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ 
            filename: path.join(logDir, 'obshlogs.txt'), 
            encoding: 'utf-8' 
        }),
        new winston.transports.Console({
            format: winston.format.printf(({ timestamp, message }) => {
                return `[${timestamp}] ${message}`;
            })
        })
    ]
});

module.exports = logger;