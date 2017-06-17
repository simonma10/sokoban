/**
 * Board prefab
 * implemented as an array of arrays
 * @type {{}}
 */

class Board {
    constructor () {
        this.data = [];
    }

    getCell (x,y) {
        var row = this.data[y];
        return row[x];
    }

    setCell (x, y, value) {
        var row = this.data[y];
        row[x] = value;
    }

    getData (){
        return this.data;
    }

    setData (data){
        //console.log("data" + data);
        this.data = data;
    }

    toString () {
        var result = "";
        for (var i = 0; i < this.data.length; i++){
            var row = this.data[i];
            result += row + "\n";
        }
        return result;
    }
}

export default Board;





