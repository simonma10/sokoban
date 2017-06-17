import Level from '../prefabs/level';
import Crate from '../prefabs/crate';
import Player from '../prefabs/player';
import {ICON_SIZE, EMPTY, WALL, SPOT, CRATE, PLAYER, FLY_TIME, debug}  from '../constants';

class GameState extends Phaser.State {
    constructor () {
        super ()

        this.data = null;
        this.level = null;
        this.player = null;
        this.crates = [];
        this.moveText = ''
        this.levelText = '';
        this.undo = [];
    }

    init (currentLevel){
        //set up page scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //initialise level and undo array
        this.currentLevel = currentLevel ? currentLevel : 1;
        this.undo=[];
    }

    preload () {
        this.load.json('data', '../static/data/soko_levels.json');

        this.load.spritesheet('player', '../static/images/player.png', ICON_SIZE, ICON_SIZE, 12);
        this.load.spritesheet('crate', '../static/images/crate.png', ICON_SIZE, ICON_SIZE, 15);
        this.load.spritesheet('block', '../static/images/block.png', ICON_SIZE, ICON_SIZE, 3);
        this.load.spritesheet('spot', '../static/images/spot.png', ICON_SIZE, ICON_SIZE, 3);
        this.load.image('redParticle', '../static/images/redParticle.png');
    }

    create () {
        //open json file and load level
        this.data = this.game.cache.getJSON('data');
        if(!this.data){
            if(debug){console.log("Data file not found.  Game will now exit.")}
            this.game.destroy();
        }
        this.level = new Level(this.data, this.currentLevel);
        this.drawBoard();

        //cursor key input
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.cursors.up.onDown.add(this.processInput, this);
        this.cursors.down.onDown.add(this.processInput, this);
        this.cursors.left.onDown.add(this.processInput, this);
        this.cursors.right.onDown.add(this.processInput, this);

        //restart level
        var keyX = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        keyX.onDown.add(this.restartLevel, this);

        //undo move
        var keyZ = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        keyZ.onDown.add(this.undoMove, this);

        //debug only: go to next level
        if(debug){
            var keyN = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
            keyN.onDown.add(this.gameWin, this);
        }
    }

    update () {
        if(this.player){
            this.moveText.text = "Moves: " + this.player.moveCounter;
        }
    }

    processInput (keyboard) {
        var dx=0;
        var dy=0;
        var anim="";
        switch(keyboard.event.key){
            case "ArrowUp":
                dy = -1;
                anim = "up";
                break;
            case "ArrowDown":
                dy = 1;
                anim = "down";
                break;
            case "ArrowLeft":
                dx = -1;
                anim = "left";
                break;
            case "ArrowRight":
                dx = 1;
                anim = "right";
                break;
            default:
                break;
        }

        const px = this.player.gridX;
        const py = this.player.gridY;
        const tarY = py + dy;
        const tarX = px + dx;
        const result = this.level.getCell(tarX, tarY);
        console.log(result);

        if(result === EMPTY || result === SPOT || result === PLAYER){
            //if(debug){console.log("Moving player from " + this.player.gridX + ", " + this.player.gridY + " to " + tarX + ", " + tarY + " with anim= " + anim)}
            if(this.level.getCell(px, py) === PLAYER + SPOT){
                this.level.setCell(px, py, SPOT);
            } else {
                this.level.setCell(px, py, EMPTY);
            }

            this.player.move(tarX, tarY, anim);

            if(result === SPOT){
                this.level.setCell(tarX, tarY, PLAYER + SPOT);
            } else {
                this.level.setCell(tarX, tarY, PLAYER);
            }
            this.storeMove(this.level);

        //pushing crate
        } else if(result === CRATE || result === CRATE + SPOT){
            const crateTarY = tarY + dy;
            const crateTarX = tarX + dx;
            const crateResult = this.level.getCell(crateTarX, crateTarY);
            //FIXME: check for Player moving CRATE+SPOT onto another CRATE+SPOT
            if(crateResult === EMPTY || crateResult === SPOT || crateResult === CRATE + SPOT){
                for (let crate of this.crates) {
                    if(crate.gridX === tarX && crate.gridY === tarY){
                        if(this.level.getCell(this.player.gridX, this.player.gridY) === PLAYER + SPOT){
                           this.level.setCell(this.player.gridX, this.player.gridY, SPOT);
                        } else {
                           this.level.setCell(this.player.gridX, this.player.gridY, EMPTY);
                        }

                        this.player.move(tarX, tarY, anim);

                       if(result === CRATE + SPOT){
                           this.level.setCell(tarX, tarY, PLAYER + SPOT);
                       } else {
                           this.level.setCell(tarX, tarY, PLAYER);
                       }

                       this.level.setCell(crateTarX, crateTarY, CRATE);
                       crate.move(crateTarX, crateTarY, 200);
                       if(crateResult === SPOT){
                           this.level.setCell(crateTarX, crateTarY, CRATE + SPOT);

                           if(this.level.checkWin() === 0){
                               this.gameWin();
                           }
                       }
                       this.storeMove(this.level);
                   }
                }
            }
        }

    }

    drawBoard () {
        const level = this.level;
        for (let i=0; i < level.height; i++){
            for (let j=0; j < level.width; j++){
                switch (level.getCell(j, i)){
                    case EMPTY:
                        //this.game.add.sprite(j*ICON_SIZE, i*ICON_SIZE, 'blank');
                        break;
                    case WALL:
                        this.wallAnim(j, i);
                        break;
                    case SPOT:
                        this.game.add.sprite(j*ICON_SIZE, i*ICON_SIZE, 'spot', 1);
                        break;
                    case CRATE:
                        this.crates.push(new Crate(this.game, j, i, 'crate'));
                        break;
                    case PLAYER:
                        this.player = new Player(this.game, j*ICON_SIZE, i*ICON_SIZE, 'player', j, i);
                        break;
                    case CRATE + SPOT:
                        this.game.add.sprite(j*ICON_SIZE, i*ICON_SIZE, 'spot', 1);
                        this.crates.push(new Crate(this.game, j, i, 'crate'));
                        break;
                    case PLAYER + SPOT:
                        this.game.add.sprite(j*ICON_SIZE, i*ICON_SIZE, 'spot', 1);
                        this.player = new Player(this.game, j*ICON_SIZE, i*ICON_SIZE, 'player', j, i);
                        break;
                    default:
                        break;
                }
            }
        }

        this.levelText = this.game.add.text(64,16,"Level " + this.currentLevel, {fill: "#FFFFFF"});
        this.moveText = this.game.add.text(825,16,"Moves: " + this.player.getMoveCount(), {fill: "#FFFFFF"});
    }

    storeMove (level) {
        /*var tempBoard = new Board();
        tempBoard.setData(level.board.getData());
        this.undo.push(tempBoard.data.toString());*/
    }

    undoMove () {
        let undo = this.undo;
        if (undo.length > 1){
            undo.pop();
            var rawString = undo.pop();
            console.log(rawString);
            var rawData = rawString.split(',');

            var undoBoard = new Sokoban.Board();
            for(var i = 0; i < this.level.height; i++){
                var tempRow = [];
                for(var j = 0; j < level.width; j++){
                    tempRow.push(parseInt(rawData[(i * this.level.width)+ j]));
                    //undoBoard.setCell(j, i, rawData[(i * level.width)+ j]);
                }
                undoBoard.data.push(tempRow);
            }

            console.log("undoBoard" + undoBoard.toString());
            //console.log(undoBoard);

            //reset the board
            this.game.world.forEach(function(sprite){
                sprite.kill();
            }, this);
            var tempMoveCounter = this.player.moveCounter;
            this.player.destroy();
            this.crates = [];

            //redraw the board
            this.level.board.setData(undoBoard.getData());
            this.drawBoard(this.level);
            this.player.moveCounter = tempMoveCounter - 1;
        }
    }

    restartLevel () {
        this.game.state.start('GameState', true, false, this.currentLevel);
    }

    gameWin () {
        const timer = this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
            this.currentLevel += 1;
            if (this.currentLevel >= parseInt(this.data.maxlevels)){
                for (let crate of this.crates){
                    crate.explode();
                }
                this.game.state.start('WinState', true, true);
            } else {
                this.game.state.start('GameState', true, true, this.currentLevel);
            }
        }, this);

        const winText = this.game.add.text(this.game.world.centerX,this.game.world.centerY,"Level Complete!", {font: "bold 64pt Arial", fill: "#FFFFFF"});
        winText.anchor.setTo(0.5);
    }

    wallAnim (gridX, gridY) {
        let wall = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'block', 0);
        const wallMove = this.game.add.tween(wall);
        wallMove.to({x: gridX * ICON_SIZE, y: gridY * ICON_SIZE}, FLY_TIME);
        wallMove.start();
    }
}

export default GameState;
