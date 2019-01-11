const guid = require('./guid');

function User(name,username,socket) {
    this.socketId = socket;
    this.tableId = undefined;
    this.name = name;
    this.username = username;
    this.id = guid();
}

module.exports = User;