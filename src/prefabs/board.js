/**
 * Board prefab
 * implemented as an array of arrays
 * @type {{}}
 */

class Board {
    constructor () {
        this.data = [];
    }

    getCell (x, y) {
        let row = this.data[y];
        return row[x];
    }

    setCell (x, y, value) {
        let row = this.data[y];
        row[x] = value;
    }

    getData () {
        return this.data;
    }

    setData (data) {
        this.data = data;
    }

    toString () {
        let result = '';
        for (let i = 0; i < this.data.length; i++) {
            let row = this.data[i];
            result += row + '\n';
        }
        return result;
    }
}

export default Board;
