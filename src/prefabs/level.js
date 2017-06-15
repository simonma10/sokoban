/**
 * Created by Simon on 27/05/2017.
 */
var Sokoban = Sokoban || {};

Sokoban.Level = function(data, level) {
    this.level = level;
    //this.levelData = [];
    this.width = 0;
    this.height = 0;
    this.board = new Sokoban.Board();

    if(this.validateData(data)){
        this.width = data.width;
        this.height = data.height;
        this.loadLevel(data);
    } else {
        if(debug){console.log("Invalid data!")}
    }
}

Sokoban.Level.prototype.validateData = function(data){
    //validate data structure
    if (data.width && data.height && data.levels){
        //TODO: [LOW] check that each data level has (width * height) elements
        //TODO: [LOW] check that all elements are valid (ie 0,1,2,3,4) using enum
        return true;
    } else {
        return false;
    }
}

Sokoban.Level.prototype.loadLevel = function(data){
    data.levels.forEach(function(levelObject){
        if(debug){console.log(levelObject)}

        if (levelObject.level === this.level){
            //this.levelData = levelObject.data;
            this.board.setData(levelObject.data);
        }
    }, this);

    //if(debug){console.log(this.board.getData())}
}


Sokoban.Level.prototype.getCell = function(x, y){
    /*var row = this.levelData[y];
    var cell = row[x];
    return cell;*/
    return this.board.getCell(x,y);

}

Sokoban.Level.prototype.setCell = function(x, y, value){
    /*var row = this.levelData[y];
    row[x] = value;*/
    this.board.setCell(x, y, value);
}

Sokoban.Level.prototype.toString = function(){
    /*var result = "";
    for (var i = 0; i < this.height; i++){
        var row = this.levelData[i];
        result += row + "\n";
    }
    return result;*/
    return "Is this still needed?";

}

Sokoban.Level.prototype.checkWin = function(){
    var countUnparkedCrates = 0;
    var countParkedCrates = 0;
    for(var i = 0; i < this.height; i++){
        for(var j = 0; j < this.width; j++){
            if(this.board.getCell(j,i) === CRATE){
                countUnparkedCrates += 1;
            } else if (this.board.getCell(j,i) === CRATE + SPOT){
                countParkedCrates += 1;
            }
        }
    }
    if(debug){console.log("Unparked/parked crates = " + countUnparkedCrates + "/" + countParkedCrates)}
    return countUnparkedCrates;
}



