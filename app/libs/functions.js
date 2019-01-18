let Table = require('./Tables');
let User = require('./User');

let lib = {};
lib.functions = {};
lib.clients = {};
lib.users = {};
lib.tables = {};
lib.rooms = {};

lib.getSocket = (username) => {
    if (username !== undefined) {
        let user = lib.users[username];
        if(user !== undefined){
            return lib.clients[user.socketId];
        }
    }
    return false
};

////////////////////////////USER///////////////////////
lib.functions['login'] = (data, socket) => {
    if (lib.users[data.username] === undefined) {
        let user = new User("", data.username, socket.id);

        socket.user = user;

        lib.users[data.username] = user;
    } else {
        socket.close();
    }
};

lib.functions['initializeTable'] = (data, socket) => {
    if (socket.user !== undefined) {
        lib.functions['initTable'](socket);
    }
};
////////////////////////////END USER///////////////////////


////////////////////////////TABLE///////////////////////
lib.functions['createTable'] = (data, socket) => {
    if (socket.user.tableId === undefined) {
        const table = new Table(data.tableName, socket.user.username);

        lib.tables[table.id] = table;

        socket.user.tableId = table.id;

        data = {
            action: 'createTable',
            data: {
                status: 0,
                id: table.id,
                name: table.name,
                count: Object.keys(lib.tables).length,
                creater: table.creater
            }
        };
        lib.functions['broadCast'](data);
    } else {
        data = {
            action: 'message',
            data: {
                status: 'error',
                message: 'Mevcut bir masanız bulunmaktadır.'
            }
        };
        lib.functions['sendMessage'](data, socket);
    }
};

lib.functions['initTable'] = (socket) => {
    if (socket.user !== undefined) {
        lib.functions['refreshCounts']();
        data = {
            action: 'initTable',
            data: {}
        };
        for (key in lib.tables) {
            data.data[key] = {
                status: lib.tables[key].status,
                id: key,
                name: lib.tables[key].name,
                creater: lib.tables[key].creater
            }
        }
        lib.functions['sendMessage'](data, socket);
    }
};

lib.functions['removeTable'] = (tableId) => {
    const data = {action: 'removeTable', data: {tableId: tableId}};
    lib.functions['broadCast'](data);
};

lib.functions['joinTable'] = (data, socket) => {
    let table = lib.tables[data.tableId];
    if (table !== undefined) {
        if (table.oppenent === undefined) {
            table.oppenent = data.apponent;
            table.status = 1;
            let createrSocket = lib.getSocket(table.creater);
            let oppenentSocket = lib.getSocket(table.oppenent);
            let redirect = {
                action: 'startGame',
                data: {
                    tableId: table.id
                }
            };
            lib.functions['sendMessage'](redirect, createrSocket);
            lib.functions['sendMessage'](redirect, oppenentSocket);
            dataE = {
                action: 'refreshTable',
                data: {
                    status: 1,
                    id: table.id,
                    name: table.name,
                    creater: table.creater,
                    oppenent: table.oppenent
                }
            };
            lib.functions['broadCast'](dataE);
        } else {
            dataE = {
                action: 'message',
                data: {
                    status: 'error',
                    message: 'Masa maça başlamış.'
                }
            };
            lib.functions['sendMessage'](dataE, socket);
        }
    } else {
        dataE = {
            action: 'message',
            data: {
                status: 'error',
                message: 'Geçersiz masa.'
            }
        };
        lib.functions['sendMessage'](dataE, socket);
    }
};

////////////////////////////END TABLE///////////////////////


////////////////////////////CLIENT INFORM///////////////////////
lib.functions['refreshCounts'] = () => {
    let data = {
        action: 'refreshCounts',
        data: {
            user: Object.keys(lib.users).length,
            table: Object.keys(lib.tables).length,
            tables: Object.keys(lib.tables),
            userNames: lib.users
        }
    };
    lib.functions['broadCast'](data);
};
////////////////////////////END CLIENT INFORM///////////////////////


////////////////////////////SOCKET///////////////////////
lib.functions['sendMessage'] = (data, socket) => {
    if (socket !== undefined && socket.readyState === 1) {
        socket.send(JSON.stringify(data));
    }
};

lib.functions['broadCast'] = (data) => {
    for (key in lib.clients) {
        if (lib.clients[key].readyState === 1)
            lib.clients[key].send(JSON.stringify(data));
    }
};

lib.functions['close'] = (socket) => {
    if (socket.user !== undefined && socket.user.tableId !== undefined && lib.tables[socket.user.tableId].status === 0) {
        lib.functions['removeTable'](socket.user.tableId);
        delete lib.tables[socket.user.tableId];
    }

    if (lib.clients[socket.id] === undefined)
        delete lib.clients[socket.id];

    if (socket.user !== undefined)
        delete lib.users[socket.user.username];
    lib.functions['refreshCounts']();
};
////////////////////////////END SOCKET///////////////////////

module.exports = lib;


lib.functions['startGame'] = (data, socket) => {
    if (lib.tables[data.tableId] === undefined) {
        lib.tables[data.tableId] = new Table('ekaraman75', 'ekaraman75');
        lib.tables[data.tableId].oppenent = "ekaraman69";
        lib.tables[data.tableId].oppenentStatus = 0;
        lib.tables[data.tableId].status = 1;
        lib.tables[data.tableId].id = data.tableId;
    }
    let table = lib.tables[data.tableId];
    if (table !== undefined && table.creater === socket.user.username) {
        table.createPieces();
        let createSocket = lib.getSocket(table.creater);
        let oppenentSocket = lib.getSocket[table.oppenent];
        table.status = 3;
        let piecesData = {
            action: 'drawPieces',
            data: {
                pieces: table.redPieceTracker,
            }
        };
        lib.functions['sendMessage'](piecesData, socket);
        if (oppenentSocket !== undefined) {
            piecesData['data']['pieces'] = table.blackPieceTracker;
            piecesData['data']['oppenentPieces'] = table.redPieceTracker;
            lib.functions['sendMessage'](piecesData, oppenentSocket);
        }
    } else {

        if (table !== undefined && table.status !== 3) {
            let redirect = {
                action: 'waiting',
                data: {
                    tableId: table.id
                }
            };
            lib.functions['sendMessage'](redirect, socket);
        } else if (table !== undefined && table.status === 3) {
            if (socket !== undefined) {
                let piecesData = {
                    action: 'drawPieces',
                    data: {
                        pieces: table.blackPieceTracker,
                    }
                };
                lib.functions['sendMessage'](piecesData, socket);


            }
        } else {
            console.log('yok');
            // let redirect = {
            //     action: 'redirect',
            //     data: {
            //         tableId: table.id
            //     }
            // };
            // lib.functions['sendMessage'](redirect, createrSocket);
        }
    }


    // lib.functions['sendMessage'](dataE, socket);
};