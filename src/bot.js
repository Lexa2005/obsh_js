require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const logger = require('./logger');
const clearLogs = require('./utils/clearLogs');
const startHandler = require('./handlers/start');
const kdHandler = require('./handlers/kd');
const messageHandler = require('./handlers/message');
const blacklist = require('./blacklist');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Запуск очистки логов
clearLogs();

// Подключение обработчиков
bot.onText(/\/start|\/help/, startHandler(bot));
bot.onText(/\/kd/, kdHandler(bot));
bot.on('message', messageHandler(bot, blacklist));

// Основная функция запуска бота
function main() {
    logger.info('Запуск бота...');
}

main();

// Обработка ошибок при запуске бота
bot.on('polling_error', (error) => {
    logger.error(`Ошибка при запуске бота: ${error.code} - ${error.message}`);
});

// Дополнительные логи для отладки
bot.on('message', (msg) => {
    logger.info(`Получено сообщение от пользователя ${msg.from.username} (ID: ${msg.from.id}): ${msg.text}`);
    logger.info(`Тип чата: ${msg.chat.type}, ID чата: ${msg.chat.id}`);
});