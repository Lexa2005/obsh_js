require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(`Идентификатор чата: ${chatId}`);
});