const fs = require('fs');
const path = require('path');
const os = require('os');
const logger = require('./logger');

function loadBlacklist(filename) {
    const filePath = path.join(__dirname, filename);
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return data.split(os.EOL).map(line => parseInt(line.trim(), 10)).filter(id => !isNaN(id));
    } else {
        logger.warn(`Файл ${filename} не найден. Создаётся пустой список.`);
        return [];
    }
}

const blacklist = loadBlacklist('blacklist.txt');

module.exports = blacklist;