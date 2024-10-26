const logger = require('../logger');
const replaceLinks = require('../utils/replaceLinks');
const config = require('../config');
const formatLog = require('../utils/logFormatter'); // Импортируем функцию форматирования логов

let lastMessageTime = 0;

function messageHandler(bot, blacklist) {
    return async (msg) => {
        const currentTime = Date.now() / 1000;
        const user = msg.from;

        if (msg.chat.type !== 'private' || msg.text === '/start') {
            return;
        }

        if (blacklist.includes(user.id)) {
            bot.sendMessage(msg.chat.id, 'Вы в черном списке');
            const logMessage = formatLog(user.username || 'Неизвестный', user.id, '❌ В черном списке.');
            logger.info(logMessage); // Сохраняем оригинальный лог
            return;
        }

        if (currentTime - lastMessageTime < config.COOLDOWN_TIME) {
            const cooldownTime = (lastMessageTime + config.COOLDOWN_TIME) - currentTime;
            bot.sendMessage(msg.chat.id, `Вы можете отправлять сообщения только раз в ${config.COOLDOWN_TIME} секунд.\nДо следующего сообщения осталось ${Math.floor(cooldownTime)} секунд.`);
            return;
        }

        if (msg.text && msg.text.length > config.MAX_MESSAGE_LENGTH) {
            bot.sendMessage(msg.chat.id, `Сообщение превышает ${config.MAX_MESSAGE_LENGTH} символов и не может быть отправлено.`);
            return;
        }

        let messageText = msg.text ? replaceLinks(msg.text) : '';

        const sendMessage = async () => {
            try {
                const channelId = process.env.TG_CHANNEL;

                if (msg.photo && config.ALLOW_PHOTO) {
                    await bot.sendPhoto(channelId, msg.photo[0].file_id);
                    const logMessage = formatLog(user.username || 'Неизвестный', user.id, '📸 Отправил фото.');
                    logger.info(logMessage); // Сохраняем оригинальный лог
                } else if (msg.video && config.ALLOW_VIDEO) {
                    await bot.sendVideo(channelId, msg.video.file_id);
                    const logMessage = formatLog(user.username || 'Неизвестный', user.id, '🎥 Отправил видео.');
                    logger.info(logMessage); // Сохраняем оригинальный лог
                } else if (msg.audio && config.ALLOW_AUDIO) {
                    await bot.sendAudio(channelId, msg.audio.file_id);
                    const logMessage = formatLog(user.username || 'Неизвестный', user.id, '🎵 Отправил аудио.');
                    logger.info(logMessage); // Сохраняем оригинальный лог
                } else if (msg.voice && config.ALLOW_VOICE) {
                    await bot.sendVoice(channelId, msg.voice.file_id);
                    const logMessage = formatLog(user.username || 'Неизвестный', user.id, '🎙️ Отправил голосовое сообщение.');
                    logger.info(logMessage); // Сохраняем оригинальный лог
                } else if (msg.text && config.ALLOW_TEXT) {
                    await bot.sendMessage(channelId, messageText);
                    const logMessage = formatLog(user.username || 'Неизвестный', user.id, `📝 Написал сообщение: "${messageText}".`);
                    logger.info(logMessage); // Сохраняем оригинальный лог
                }

                lastMessageTime = currentTime;
            } catch (error) {
                const errorLogMessage = formatLog(user.username || 'Неизвестный', user.id, `❌ Не удалось отправить сообщение: ${error}`);
                logger.error(errorLogMessage); // Сохраняем оригинальный лог ошибки
            }
        };

        sendMessage();
    };
}

module.exports = messageHandler;