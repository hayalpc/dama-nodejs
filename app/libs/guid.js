function guid() {
    return "ss-s-s-s-sss".replace(/s/g, s4);
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

module.exports = guid;