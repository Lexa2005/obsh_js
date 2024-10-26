const logger = require('../logger');
const replaceLinks = require('../utils/replaceLinks');

let lastMessageTime = 0;
const COOLDOWN_TIME = 10; // 10 секунд

function messageHandler(bot, blacklist) {
    return async (msg) => {
        const currentTime = Date.now() / 1000;
        const user = msg.from;

        // Проверка, что сообщение отправлено лично боту, а не в канал
        if (msg.chat.type !== 'private') {
            return;
        }

        // Проверка ID на наличие в черном списке
        if (blacklist.includes(user.id)) {
            bot.sendMessage(msg.chat.id, 'Вы в черном списке');
            logger.info(`Пользователь с ID ${user.id} попытался отправить сообщение, но он в черном списке.`);
            return;
        }

        // Проверка на частоту сообщений
        if (currentTime - lastMessageTime < COOLDOWN_TIME) {
            const cooldownTime = (lastMessageTime + COOLDOWN_TIME) - currentTime;
            const seconds = Math.floor(cooldownTime);
            bot.sendMessage(msg.chat.id, `Вы можете отправлять сообщения только раз в ${COOLDOWN_TIME} секунд.\nДо следующего сообщения осталось ${seconds} секунд.`);
            logger.info(`Пользователь ${user.username} (ID: ${user.id}) пытался отправить сообщение во время кд`);
            return;
        }

        // Проверка на длину сообщения
        if (msg.text && msg.text.length > 200) {
            bot.sendMessage(msg.chat.id, 'Сообщение превышает 200 символов и не может быть отправлено.');
            logger.info(`Пользователь ${user.username} (ID: ${user.id}) отправил сообщение, превышающее 200 символов.`);
            return;
        }

        // Замена ссылок на "ссылка удалена"
        let messageText = msg.text ? replaceLinks(msg.text) : '';

        // Отправка сообщения в канал
        const sendMessage = async () => {
            try {
                const channelId = process.env.TG_CHANNEL;

                if (msg.photo) {
                    const fileId = msg.photo[msg.photo.length - 1].file_id;
                    await bot.sendPhoto(channelId, fileId, { caption: msg.caption });
                    logger.info(`${user.first_name} ${user.last_name} (@${user.username}) отправил фото в ${new Date().toISOString()} (ID: ${user.id})`);
                } else if (msg.video) {
                    await bot.sendVideo(channelId, msg.video.file_id, { caption: msg.caption });
                    logger.info(`${user.first_name} ${user.last_name} (@${user.username}) отправил видео в ${new Date().toISOString()} (ID: ${user.id})`);
                } else if (msg.audio) {
                    await bot.sendAudio(channelId, msg.audio.file_id, { caption: msg.caption });
                    logger.info(`${user.first_name} ${user.last_name} (@${user.username}) отправил аудио в ${new Date().toISOString()} (ID: ${user.id})`);
                } else if (msg.voice) {
                    await bot.sendVoice(channelId, msg.voice.file_id, { caption: msg.caption });
                    logger.info(`${user.first_name} ${user.last_name} (@${user.username}) отправил голосовое сообщение в ${new Date().toISOString()} (ID: ${user.id})`);
                } else if (msg.video_note) {
                    await bot.sendDocument(channelId, msg.video_note.file_id, { caption: msg.caption });
                    logger.info(`${user.first_name} ${user.last_name} (@${user.username}) отправил видеозаметку в ${new Date().toISOString()} (ID: ${user.id})`);
                } else if (msg.text) {
                    await bot.sendMessage(channelId, messageText);
                    logger.info(`${user.first_name} ${user.last_name} (@${user.username}) написал сообщение в ${new Date().toISOString()} (ID: ${user.id})`);
                } else if (msg.sticker) {
                    await bot.sendSticker(channelId, msg.sticker.file_id);
                    logger.info(`${user.first_name} ${user.last_name} (@${user.username}) отправил стикер в ${new Date().toISOString()} (ID: ${user.id})`);
                }

                lastMessageTime = currentTime;
            } catch (error) {
                if (error.response && error.response.statusCode === 429) {
                    const retryAfter = error.response.body.parameters.retry_after;
                    logger.warning(`Слишком много запросов. Повтор через ${retryAfter} секунд.`);
                    setTimeout(sendMessage, (retryAfter + 2) * 1000); // Дополнительные 2 секунды перед повторной отправкой
                } else {
                    logger.error(`Не удалось отправить сообщение: ${error}`);
                }
            }
        };

        sendMessage();
    };
}

module.exports = messageHandler;