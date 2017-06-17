import Board from './board';
import { CRATE, SPOT, debug } from '../constants';


class Level {
    constructor(data, level){
        this.level = level;
        //this.levelData = [];
        this.width = 0;
        this.height = 0;
        this.board = new Board();

        if(this.validateData(data)){
            this.width = data.width;
            this.height = data.height;
            this.loadLevel(data);
        } else {
            if(debug){console.log("Invalid data!")}
        }
    }


    validateData (data){
        //validate data structure
        if (data.width && data.height && data.levels){
            //TODO: [LOW] check that each data level has (width * height) elements
            //TODO: [LOW] check that all elements are valid (ie 0,1,2,3,4) using enum
            return true;
        } else {
            return false;
        }
    }

    loadLevel (data){
        data.levels.forEach(function(levelObject){
            if(debug){console.log(levelObject)}

            if (levelObject.level === this.level){
                //this.levelData = levelObject.data;
                this.board.setData(levelObject.data);
            }
        }, this);

        //if(debug){console.log(this.board.getData())}
    }


    getCell (x, y){
        /*var row = this.levelData[y];
         var cell = row[x];
         return cell;*/
        return this.board.getCell(x,y);
    }

    setCell (x, y, value){
        /*var row = this.levelData[y];
         row[x] = value;*/
        this.board.setCell(x, y, value);
    }

    toString (){
        /*var result = "";
         for (var i = 0; i < this.height; i++){
         var row = this.levelData[i];
         result += row + "\n";
         }
         return result;*/
        return "Is this still needed?";
    }

    checkWin (){
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
}

export default Level;

