const fs = require('fs');
const path = require('path');
const logger = require('../logger');

const LOG_FILE = 'obshlogs.txt';
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5 MB

function clearLogs() {
    setInterval(() => {
        const logFilePath = path.join(__dirname, '..', 'obshlogs', LOG_FILE);
        if (fs.existsSync(logFilePath) && fs.statSync(logFilePath).size > MAX_LOG_SIZE) {
            fs.truncateSync(logFilePath, 0);
            logger.info('Файл логов очищен из-за превышения допустимого размера.');
        }
    }, 60000); // Проверяем размер файла каждые 60 секунд
}

module.exports = clearLogs;
