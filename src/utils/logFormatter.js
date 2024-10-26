// Функция для форматирования логов
function formatLog(username, userId, message) {
    const timestamp = new Date().toLocaleString();
    return `[${timestamp}] ${username} (ID: ${userId}) | ${message}`;
}

module.exports = formatLog;