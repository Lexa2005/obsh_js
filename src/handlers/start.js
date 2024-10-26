const logger = require('../logger');

function startHandler(bot) {
    return (msg) => {
        const user = msg.from;
        logger.info(`Пользователь ${user.username} (ID: ${user.id}) запустил бота.`);
        bot.sendMessage(msg.chat.id, 'Кд одна минута. Может не работать.\nСоздал @theplusminus и @BlenderSkyQ');
    };
}

module.exports = startHandler;
