require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const logger = require('./logger');
const clearLogs = require('./utils/clearLogs');
const startHandler = require('./handlers/start');
const kdHandler = require('./handlers/kd');
const messageHandler = require('./handlers/message');
const blacklist = require('./blacklist');
const formatLog = require('./utils/logFormatter'); // Импортируем функцию форматирования логов

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Флаг, указывающий, запущен ли бот
let isBotRunning = false;

// Запуск очистки логов
clearLogs();

// Подключение обработчиков
bot.onText(/\/start|\/help/, startHandler(bot));
bot.onText(/\/kd/, kdHandler(bot));
bot.on('message', (msg) => {
    if (isBotRunning) {
        messageHandler(bot, blacklist)(msg);
    }
});

// Основная функция запуска бота
function main() {
    isBotRunning = true;
    const logMessage = formatLog('Бот', 'N/A', '✅ Бот успешно запущен.');
    logger.info(logMessage); // Сохраняем оригинальный лог в файл
}

// Запускаем бота
main();

// Обработка ошибок при запуске бота
bot.on('polling_error', (error) => {
    const errorMessage = formatLog('Бот', 'N/A', `❌ Ошибка при запуске бота: ${error.code} - ${error.message}`);
    logger.error(errorMessage); // Сохраняем оригинальный лог ошибки в файл
});

// Дополнительные логи для отладки
bot.on('message', (msg) => {
    const user = msg.from;
    const logMessage = formatLog(user.username || 'Неизвестный', user.id, `${msg.text} | Тип чата: ${msg.chat.type}, ID чата: ${msg.chat.id}`);
    logger.info(logMessage); // Сохраняем оригинальный лог в файл
});