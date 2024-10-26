const logger = require('../logger');

function startHandler(bot) {
    return (msg) => {
        const user = msg.from;
        logger.info(`Пользователь ${user.username} (ID: ${user.id}) запустил бота.`);
        bot.sendMessage(msg.chat.id, 'Кд 10 сек. Может не работать.\nСоздал @lexa2005, на основе бота от @theplusminus и @BlenderSkyQ');
    };
}

module.exports = startHandler;
