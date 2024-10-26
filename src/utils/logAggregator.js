const fs = require('fs');
const path = require('path');
const formatLog = require('./logFormatter'); // Импортируем функцию форматирования

// Путь к файлам логов
const originalLogFilePath = path.join(__dirname, '../../obshlogs/obshlogs.txt');
const formattedLogFilePath = path.join(__dirname, '../../obshlogs/formatlogs.txt');

// Функция для чтения оригинальных логов из файла
function readOriginalLogs(filePath) {
    return fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
}

// Функция для записи отформатированных логов в файл
function writeFormattedLogs(logs) {
    const formattedLogs = logs.map(log => {
        const regex = /(\w+ \d+ \d+ \d+:\d+:\d+) (.*?): (.*)/;
        const match = log.match(regex);

        if (match) {
            const timestamp = match[1];
            const messageType = match[2];
            const messageContent = match[3];
            return formatLog('Лог агрегатор', 'N/A', `${messageType}: ${messageContent}`);
        }
        return null;
    }).filter(Boolean);

    fs.writeFileSync(formattedLogFilePath, formattedLogs.join('\n'), { flag: 'a' }); // Записываем в файл
}

// Основная функция для агрегации и вывода логов
function aggregateAndPrintLogs() {
    const originalLogs = readOriginalLogs(originalLogFilePath);
    writeFormattedLogs(originalLogs);
    
    // Чтение отформатированных логов и вывод в консоль
    const formattedLogs = readOriginalLogs(formattedLogFilePath);
    formattedLogs.forEach(log => console.log(log));
}

module.exports = aggregateAndPrintLogs;