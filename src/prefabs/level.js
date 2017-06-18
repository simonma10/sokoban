import Board from './board';
import { CRATE, SPOT, debug } from '../constants';

class Level {
    constructor (data, level) {
        this.level = level;
        this.width = 0;
        this.height = 0;
        this.board = new Board();

        if (this.validateData(data)) {
            this.width = data.width;
            this.height = data.height;
            this.loadLevel(data);
        } else {
            if (debug) { console.log('Invalid data!') }
        }
    }

    validateData (data) {
        // validate data structure
        if (data.width && data.height && data.levels) {
            // TODO: [LOW] check that each data level has (width * height) elements
            // TODO: [LOW] check that all elements are valid (ie 0,1,2,3,4) using enum
            return true;
        } else {
            return false;
        }
    }

    loadLevel (data) {
        data.levels.forEach((levelObject) => {
            if (debug) { console.log(levelObject) }

            if (levelObject.level === this.level) {
                this.board.setData(levelObject.data);
            }
        }, this);
    }

    getCell (x, y) {
        return this.board.getCell(x, y);
    }

    setCell (x, y, value) {
        this.board.setCell(x, y, value);
    }

    checkWin () {
        let countUnparkedCrates = 0;
        let countParkedCrates = 0;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.board.getCell(j, i) === CRATE) {
                    countUnparkedCrates += 1;
                } else if (this.board.getCell(j, i) === CRATE + SPOT) {
                    countParkedCrates += 1;
                }
            }
        }
        if (debug) { console.log('Unparked/parked crates = ' + countUnparkedCrates + '/' + countParkedCrates) }
        return countUnparkedCrates;
    }
}

export default Level;
