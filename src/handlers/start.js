const logger = require('../logger');

function startHandler(bot) {
    return (msg) => {
        const user = msg.from;
        logger.info(`[${new Date().toLocaleString()}] 🚀 ${user.username} (ID: ${user.id}) запустил бота.`);
        bot.sendMessage(msg.chat.id, 'Кд одна минута. Может не работать.\nСоздал @LexaDrab на основе бота от @theplusminus и @BlenderSkyQ');
    };
}

module.exports = startHandler;