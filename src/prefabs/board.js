/**
 * Created by Simon on 29/05/2017.
 */

/**
 * Board prefab
 * implemented as an array of arrays
 * @type {{}}
 */
var Sokoban = Sokoban || {};

Sokoban.Board = function() {
    this.data = [];
}

Sokoban.Board.prototype.getCell = function(x,y){
    var row = this.data[y];
    return row[x];
}

Sokoban.Board.prototype.setCell = function(x,y, value){
    var row = this.data[y];
    row[x] = value;
}

Sokoban.Board.prototype.getData = function(){
    return this.data;
}

Sokoban.Board.prototype.setData = function(data){
    //console.log("data" + data);
    this.data = data;
}

Sokoban.Board.prototype.toString = function(){
    var result = "";
    for (var i = 0; i < this.data.length; i++){
        var row = this.data[i];
        result += row + "\n";
    }
    return result;
}
