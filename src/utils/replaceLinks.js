const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

function replaceLinks(text) {
    return text.replace(urlPattern, 'ссылка удалена');
}

module.exports = replaceLinks;
