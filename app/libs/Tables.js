const guid = require('./guid');
const piece = require('./piece');
let BLACK = "#000000";
let RED = "#FF0000";

function Tables(name,username) {

    this.status = 0;
    this.name = name;
    this.users = [];
    this.blackPieceTracker = {};
    this.redPieceTracker = {};
    this.creater = username;
    this.id = guid();
}

Tables.prototype.createPieces = function () {
    for(let j = 2; j < 8; j++) {
        for(let i = 1; i < 9; i++) {
            if(j < 4) {
                this.blackPieceTracker[i.toString() + j.toString()] = new piece(i,j,false,BLACK);
            } else if(j > 5) {
                this.redPieceTracker[i.toString() + j.toString()] = new piece(i,j,false,RED);
            }
        }
    }
};

Tables.prototype.updateDate = function () {
};

module.exports = Tables;