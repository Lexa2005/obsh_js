const logger = require('../logger');

let lastMessageTime = 0;
const COOLDOWN_TIME = 10; // 10 секунд

function kdHandler(bot) {
    return (msg) => {
        const user = msg.from;
        if (lastMessageTime === 0) {
            bot.sendMessage(msg.chat.id, `Можете отправлять сообщения.`);
        } else {
            const currentTime = Date.now() / 1000;
            const cooldownTime = (lastMessageTime + COOLDOWN_TIME) - currentTime;
            if (cooldownTime <= 0) {
                bot.sendMessage(msg.chat.id, `Можете отправлять сообщения.`);
            } else {
                const seconds = Math.floor(cooldownTime);
                bot.sendMessage(msg.chat.id, `До следующего сообщения осталось ${seconds} секунд.`);
            }
        }
        logger.info(`Пользователь ${user.username} (ID: ${user.id}) проверил кд.`);
    };
}

module.exports = kdHandler;