function piece(x,y,k,c)
{
    // Set the column, row, king, and color for each piece
    this.col = x;
    this.row = y;
    this.king = k;
    this.color = c;
}

module.exports = piece;