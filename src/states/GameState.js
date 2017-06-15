/**
 * Created by Simon on 27/05/2017.
 * @@Version 0.2
 */

var Sokoban = Sokoban || {};

//level layout constants
const ICON_SIZE = 64;
const EMPTY = 0;
const WALL = 1;
const SPOT = 2;
const CRATE = 3;
const PLAYER = 4;

//global variables
var debug = true;
var data;
var level;
var player;
var crates = [];
var maxLevel;
var moveText, levelText;
var undo = [];

Sokoban.GameState = {
    init: function(currentLevel){
        //set up page scaling
        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //initialise level and undo array
        this.currentLevel = currentLevel ? currentLevel : 1;
        undo=[];
    },

    preload: function(){
        this.load.json('data', './assets/data/soko_levels.json');

        this.load.spritesheet('player', './assets/player.png', ICON_SIZE, ICON_SIZE, 12);
        this.load.spritesheet('crate', './assets/crate.png', ICON_SIZE, ICON_SIZE, 15);
        this.load.spritesheet('block', './assets/block.png', ICON_SIZE, ICON_SIZE, 3);
        this.load.spritesheet('spot', './assets/spot.png', ICON_SIZE, ICON_SIZE, 3);
        this.load.image('redParticle', './assets/redParticle.png');

    },

    create:function(){
        //open json file and load level
        data = this.game.cache.getJSON('data');
        if(!data){
            if(debug){console.log("Data file not found!")}
            this.game.destroy();
        }
        if(this.currentLevel > data.maxlevels){
            //TODO: something a little more exciting for winning the game!
            //this.game.state.start('WinState', true, false);
        }
        level = new Sokoban.Level(data, this.currentLevel);
        this.drawBoard(level);


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
        //TODO: undo array and button (next version)

    },

    update: function(){
        moveText.text = "Moves: " + player.moveCounter;
    },

    render: function(){
        if(debug){
            //this.game.debug.text(undo.length + ", " + player.sprite.y, 32,32);
        }
    },

    processInput: function(keyboard){
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
        var targetRow = player.gridY + dy;
        var targetCell = player.gridX + dx;
        var result = level.getCell(targetCell, targetRow);

        if(result === EMPTY || result === SPOT || result === PLAYER){
            //console.log(result, level.getCell(player.gridX, player.gridY));
            if(debug){console.log("Moving player from " + player.gridX + ", " + player.gridY + " to " + targetCell + ", " + targetRow + anim)}
            if(level.getCell(player.gridX, player.gridY) === PLAYER + SPOT){
                level.setCell(player.gridX, player.gridY, SPOT);
            } else {
                level.setCell(player.gridX, player.gridY, EMPTY);
            }

            player.move(targetCell, targetRow, anim);

            if(result === SPOT){
                level.setCell(targetCell, targetRow, PLAYER + SPOT);
            } else {
                level.setCell(targetCell, targetRow, PLAYER);
            }

            //if(debug){console.log(level.toString())}
            this.storeMove(level);

            //pushing crate
        } else if(result === CRATE || result === CRATE + SPOT){
            var crateTargetRow = targetRow + dy;
            var crateTargetCell = targetCell + dx;
            var crateResult = level.getCell(crateTargetCell, crateTargetRow);
            //FIXME: check for Player moving CRATE+SPOT onto another CRATE+SPOT
            if(crateResult === EMPTY || crateResult === SPOT || crateResult === CRATE + SPOT){
                crates.forEach(function(crate){
                   if(crate.gridX === targetCell && crate.gridY === targetRow){

                       if(level.getCell(player.gridX, player.gridY) === PLAYER + SPOT){
                           level.setCell(player.gridX, player.gridY, SPOT);
                       } else {
                           level.setCell(player.gridX, player.gridY, EMPTY);
                       }

                       player.move(targetCell, targetRow, anim);

                       if(result === CRATE + SPOT){
                           level.setCell(targetCell, targetRow, PLAYER + SPOT);
                       } else {
                           level.setCell(targetCell, targetRow, PLAYER);
                       }

                       level.setCell(crateTargetCell, crateTargetRow, CRATE);
                       crate.move(crateTargetCell, crateTargetRow);
                       if(crateResult === SPOT){
                           level.setCell(crateTargetCell, crateTargetRow, CRATE + SPOT);

                           if(level.checkWin() === 0){
                               this.gameWin();
                           }
                       }
                       //if(debug){console.log(level.toString())}
                       this.storeMove(level);
                   }
                }, this);
            }
        }

    },

    drawBoard: function(level){
        for (var i=0; i < level.height; i++){
            //var row = board.levelData[i];

            for (var j=0; j < level.width; j++){

                switch (level.getCell(j, i)){
                    case EMPTY:
                        //this.game.add.sprite(j*ICON_SIZE, i*ICON_SIZE, 'blank');
                        break;
                    case WALL:
                        this.game.add.sprite(j*ICON_SIZE, i*ICON_SIZE, 'block',0);
                        break;
                    case SPOT:
                        this.game.add.sprite(j*ICON_SIZE, i*ICON_SIZE, 'spot', 1);
                        break;
                    case CRATE:
                        crates.push(new Sokoban.Crate(this.game, j, i, 'crate'));
                        break;
                    case PLAYER:
                        player = new Sokoban.Player(this.game, j*ICON_SIZE, i*ICON_SIZE, 'player', j, i);
                        break;
                    case CRATE + SPOT:
                        this.game.add.sprite(j*ICON_SIZE, i*ICON_SIZE, 'spot', 1);
                        crates.push(new Sokoban.Crate(this.game, j, i, 'crate'));
                        break;
                    case PLAYER + SPOT:
                        this.game.add.sprite(j*ICON_SIZE, i*ICON_SIZE, 'spot', 1);
                        player = new Sokoban.Player(this.game, j*ICON_SIZE, i*ICON_SIZE, 'player', j, i);
                        break;
                    default:
                        break;
                }
            }
        }

        levelText = this.game.add.text(64,16,"Level " + this.currentLevel, {fill: "#FFFFFF"});
        moveText = this.game.add.text(825,16,"Moves: " + player.moveCounter, {fill: "#FFFFFF"});


    },

    storeMove: function(level){
        var tempBoard = new Sokoban.Board();
        tempBoard.setData(level.board.getData());
        undo.push(tempBoard.data.toString());
    },

    undoMove: function(){
        if (undo.length > 1){
            undo.pop();
            var rawString = undo.pop();
            console.log(rawString);
            var rawData = rawString.split(',');

            var undoBoard = new Sokoban.Board();
            for(var i = 0; i < level.height; i++){
                var tempRow = [];
                for(var j = 0; j < level.width; j++){
                    tempRow.push(parseInt(rawData[(i * level.width)+ j]));
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
            var tempMoveCounter = player.moveCounter;
            player.destroy();
            crates = [];

            //redraw the board
            level.board.setData(undoBoard.getData());
            this.drawBoard(level);
            player.moveCounter = tempMoveCounter - 1;
        }



    },

    restartLevel: function(){
        this.game.state.start('GameState', true, false, this.currentLevel);
    },

    gameWin: function(){

        var timer = this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
            this.currentLevel += 1;

            if (this.currentLevel >= parseInt(data.maxlevels)){

                crates.forEach(function(crate){
                    crate.explode();
                }, this);
                this.game.state.start('WinState', true, true);
            } else {
                this.game.state.start('GameState', true, true, this.currentLevel);
            }

        }, this);

        var winText = this.game.add.text(this.game.world.centerX,this.game.world.centerY,"Level Complete!", {font: "bold 64pt Arial", fill: "#FFFFFF"});
        winText.anchor.setTo(0.5);

    }
}

