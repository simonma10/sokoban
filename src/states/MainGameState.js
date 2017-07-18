import Phaser from 'phaser-ce';

import Level from '../prefabs/level';
import Crate from '../prefabs/crate';
import Player from '../prefabs/player';
import {
    ICON_SIZE,
    MOVE_TIME,
    FPS,
    DELAY,
    OBJECT_LAYER,
    BLOCKING_LAYER,
    BACKGROUND_LAYER,
    MAX_LEVELS,
    debug} from '../constants';

class MainGameState extends Phaser.State {
    constructor () {
        super();

        this.crates = [];
        this.moveText = '';
        this.levelText = 'Level ';
        this.playerIsMoving = false;
        this.crateIsMoving = false;
        this.crateBlocked = false;
        this.direction = new Phaser.Point(0,0);
        this.moveCounter = 0;
    }

    init (currentLevel) {
        // set up page scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // initialise level
        this.currentLevel = currentLevel ? currentLevel : 1;
        this.currentLevelString = ('000' + this.currentLevel.toString()).slice(-3);
        this.moveCounter = 0;
    }

    preload () {
        this.load.spritesheet('playerSprite', '../static/images/player.png', ICON_SIZE, ICON_SIZE, 12);
        this.load.spritesheet('crateSprite', '../static/images/crate.png', ICON_SIZE, ICON_SIZE, 4);
        this.load.spritesheet('spotSprite', '../static/images/spot.png', ICON_SIZE, ICON_SIZE, 3);
        this.load.tilemap('soko', '../../tmx/soko' + this.currentLevelString + '.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('gameTiles', '../static/images/sokoban_tilesheet.png', false);
    }

    create () {
        // Load tilemap and create layers
        this.map = this.game.add.tilemap('soko');
        this.map.addTilesetImage('sokoban_tilesheet', 'gameTiles', ICON_SIZE, ICON_SIZE, 0, 0, 0);
        this.backgroundLayer = this.map.createLayer(BACKGROUND_LAYER);
        this.blockingLayer = this.map.createLayer(BLOCKING_LAYER);
        this.map.setCollisionBetween(1, 2000, true, BLOCKING_LAYER);

        // Create group of parking 'spots'
        this.spots = this.game.add.group();
        this.spots.enableBody = true;
        this.findObjectsByType('spot', this.map, OBJECT_LAYER).forEach( (element) => {
            this.createFromTiledObject(element, this.spots);
        }, this);

        // Create group of crates
        this.crates = this.game.add.group();
        this.crates.enableBody = true;
        this.findObjectsByType('crate', this.map, OBJECT_LAYER).forEach( (element) => {
            this.createFromTiledObject(element, this.crates, 1);
        }, this);

        // Create player sprite
        this.player = this.game.add.sprite(50, 50, 'playerSprite', 12);
        this.player.enableBody = true;
        this.game.physics.arcade.enable(this.player);
        this.game.camera.follow(this.player);
        this.player.animations.add('left', [9, 7, 8, 7], FPS, false);
        this.player.animations.add('right', [6, 4, 5, 4], FPS, false);
        this.player.animations.add('down', [11, 10, 0, 10], FPS, false);
        this.player.animations.add('up', [3, 1, 2, 1], FPS, false);
        this.findObjectsByType('player', this.map, OBJECT_LAYER).forEach( (element) => {
            this.player.position.setTo(element.x, element.y);
        }, this);

        // Set up keyboard input
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.cursors.up.onDown.add(this.processInput, this);
        this.cursors.down.onDown.add(this.processInput, this);
        this.cursors.left.onDown.add(this.processInput, this);
        this.cursors.right.onDown.add(this.processInput, this);

        // Key X = restart level
        let keyX = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        keyX.onDown.add(this.restartLevel, this);

        // Key Z = undo move
        let keyZ = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        keyZ.onDown.add(this.undoMove, this);

        // ** debug only ** Key N = go to next level
        if (debug) {
            let keyN = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
            keyN.onDown.add(this.gameWin, this);
        }

        this.levelText = this.game.add.text(64, 16, 'Level ' + this.currentLevel, {fill: '#FFFFFF'});
        this.moveText = this.game.add.text(825, 16, 'Moves: ' + this.moveCounter, {fill: '#FFFFFF'});
    }

    render () {
        /*if(debug){
            this.game.debug.spriteInfo(this.player, 32, 650);
            this.game.debug.text(this.playerIsMoving, 850, 650);
            this.game.debug.text(this.crateIsMoving, 850, 680);
            this.game.debug.text(this.moveCounter, 800, 650);
            this.game.debug.text(this.currentLevel, 800, 600);
        }*/
    }

    update () {
        this.moveText.text = 'Moves: ' + this.moveCounter;
        this.game.physics.arcade.collide(this.player, this.blockingLayer);
        this.game.physics.arcade.collide(this.crates, this.blockingLayer);
    }

    processInput (keyboard) {
        if(this.playerIsMoving === true){
            return;
        };
        this.playerIsMoving = true;
        let anim = '';

        switch (keyboard.event.key) {
            case 'ArrowUp':
                this.direction.setTo(0, -ICON_SIZE);
                anim = 'up';
                break;
            case 'ArrowDown':
                this.direction.setTo(0, ICON_SIZE);
                anim = 'down';
                break;
            case 'ArrowLeft':
                this.direction.setTo(-ICON_SIZE, 0);
                anim = 'left';
                break;
            case 'ArrowRight':
                this.direction.setTo(ICON_SIZE, 0);
                anim = 'right';
                break;
            default:
                break;
        }

        // Reset the flag to check whether a crate is blocked or not
        this.crateBlocked = false;
        this.checkIfSpriteCanMove(this.player, this.direction, MOVE_TIME, 0, anim);
    }

    crateCollideCallback(sprite, child){
        if(sprite.key === 'crateSprite'){
            if(debug) {console.log('crate blocked by another crate');}
            this.crateBlocked = true;
            this.playerIsMoving = false;
            return;
        }
        if (debug) {console.log('pushing crate');}
        this.checkIfSpriteCanMove(child, this.direction, MOVE_TIME);
    }

    /**
     * checkIfSpriteCanMove - tests various conditions before calling spriteMove
     * @param sprite
     * @param direction
     * @param time
     * @param delay
     * @param anim
     */
    checkIfSpriteCanMove (sprite, direction, time, delay, anim='') {
        // Raycast line
        const offset = ICON_SIZE / 2;       // Calculate an offset, so that raycast comes from middle of sprite
        this.line = new Phaser.Line();
        this.line.start.set(sprite.x + offset, sprite.y + offset);
        this.line.end.set(sprite.x + offset + direction.x, sprite.y + offset + direction.y);

        // Check collision with blocking layer
        let tileHits = this.blockingLayer.getRayCastTiles(this.line, 1, false, true);
        if (tileHits.length > 0){
            for (let i = 0; i < tileHits.length; i++){
                if(tileHits[i].index !== -1){               // -1 refers to a blank or null tile
                    if(debug) {console.log(sprite.key + ' hit blocking layer');}
                    if(sprite.key === 'crateSprite'){
                        this.crateBlocked = true;
                        this.crateIsMoving = false;
                    }
                    this.playerIsMoving = false;
                    return;
                }
            }
        }

        // Check collision with crates
        let getObjects = this.game.physics.arcade.getObjectsAtLocation(
            sprite.x + offset + direction.x,
            sprite.y + offset + direction.y,
            this.crates,
            this.crateCollideCallback,
            this,
            sprite);
        if(getObjects.length === 0){                                    // No collision: move the sprite
            this.moveSprite(sprite, direction, time, delay, anim);
        } else if (sprite.key === 'playerSprite'){                      // Sprite collided with crate AND sprite = player
            if(this.crateBlocked === false){                            // AND crate is not blocked
                this.moveSprite(sprite, direction, time, delay, anim);
            }
        }
    }

    /**
     * moveSprite - called from checkIfSpriteCanMove.
     * Moves crate or player, and checks game win conditions
     * @param sprite
     * @param direction
     * @param time
     * @param delay
     * @param anim
     */
    moveSprite(sprite, direction, time, delay, anim=''){
        let tween = this.game.add.tween(sprite);
        tween.to({x: sprite.x + direction.x, y: sprite.y + direction.y}, time, null, false, delay, 0, false);
        tween.onComplete.add(function () {
            if(sprite.key === 'playerSprite'){
                this.moveCounter += 1;
                this.playerIsMoving = false;
            } else {
                this.crateIsMoving = false;
            }
            let parkedCrateCounter = 0;
            this.crates.forEach( (crate) => {
                if(this.game.physics.arcade.overlap(crate, this.spots, null, null, this)){
                    parkedCrateCounter += 1;
                };
            });
            if (sprite.key === 'playerSprite' && parkedCrateCounter === this.crates.length){
                if(debug) {console.log('Level complete');}
                this.gameWin();
            }
        }, this);
        if(anim !== ''){
            sprite.animations.play(anim);
        }
        tween.start();
    }

    undoMove(){
        console.log('undo not implemented yet... sorry');
    }

    /**
     * findObjectsByType: helper function - returns array of elements
     * @param type
     * @param map
     * @param layer
     * @returns {Array}
     */
    findObjectsByType (type, map, layer){
        let result = [];
        map.objects[layer].forEach( (element) => {
            if (element.type === type) {
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    }

    /**
     * createFromTiledObject: helper function - creates a sprite and copies custom properties
     * @param element
     * @param group
     */
    createFromTiledObject(element, group, frame){
        if(element.properties) {
            let sprite = group.create(element.x, element.y, element.properties.sprite, frame);
            // copy all custom properties to the sprite (if any exist)
            Object.keys(element.properties).forEach ( (key) => {
                sprite[key] = element.properties[key];
            });
        }
    }

    restartLevel () {
        this.game.state.start('MainGameState', true, false, this.currentLevel);
    }

    gameWin () {
        this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            this.currentLevel += 1;
            if (this.currentLevel > MAX_LEVELS) {
                this.game.state.start('WinState', true, true);
            } else {
                this.game.state.start('MainGameState', true, true, this.currentLevel);
            }
        }, this);

        const winText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Level Complete!', {font: 'bold 64pt Arial', fill: '#FFFFFF'});
        winText.anchor.setTo(0.5);
    }
}
export default MainGameState;


/*

 // Open json file and load level
 this.data = this.game.cache.getJSON('data');
 if (!this.data) {
 if (debug) { console.log('Data file not found.  Game will now exit.') }
 this.game.destroy();
 }
 this.level = new Level(this.data, this.currentLevel);
 this.drawBoard();


*/
/*

drawBoard () {
    const level = this.level;
    for (let i = 0; i < level.height; i++) {
        for (let j = 0; j < level.width; j++) {
            switch (level.getCell(j, i)) {
                case EMPTY:
                    // this.game.add.sprite(j*ICON_SIZE, i*ICON_SIZE, 'blank');
                    break;
                case WALL:
                    this.addSprite(j, i, 'block', 0);
                    break;
                case SPOT:
                    this.addSprite(j, i, 'spot', 1);
                    break;
                case CRATE:
                    this.crates.push(new Crate(this.game, j, i, 'crate'));
                    break;
                case PLAYER:
                    this.player = new Player(this.game, j * ICON_SIZE, i * ICON_SIZE, 'player', j, i);
                    break;
                case CRATE + SPOT:
                    this.game.add.sprite(j * ICON_SIZE, i * ICON_SIZE, 'spot', 1);
                    this.crates.push(new Crate(this.game, j, i, 'crate'));
                    break;
                case PLAYER + SPOT:
                    this.game.add.sprite(j * ICON_SIZE, i * ICON_SIZE, 'spot', 1);
                    this.player = new Player(this.game, j * ICON_SIZE, i * ICON_SIZE, 'player', j, i);
                    break;
                default:
                    break;
            }
        }
    }

    this.levelText = this.game.add.text(64, 16, 'Level ' + this.currentLevel, {fill: '#FFFFFF'});
    this.moveText = this.game.add.text(825, 16, 'Moves: ' + this.player.getMoveCount(), {fill: '#FFFFFF'});
}*/
/*

const px = this.player.gridX;
const py = this.player.gridY;
const tarY = py + dy;
const tarX = px + dx;
const result = this.level.getCell(tarX, tarY);
console.log(result);

if (result === EMPTY || result === SPOT || result === PLAYER) {
    // if(debug){console.log("Moving player from " + this.player.gridX + ", " + this.player.gridY + " to " + tarX + ", " + tarY + " with anim = " + anim)}
    if (this.level.getCell(px, py) === PLAYER + SPOT) {
        this.level.setCell(px, py, SPOT);
    } else {
        this.level.setCell(px, py, EMPTY);
    }
    this.player.move(tarX, tarY, MOVE_TIME, 0, anim);

    if (result === SPOT) {
        this.level.setCell(tarX, tarY, PLAYER + SPOT);
    } else {
        this.level.setCell(tarX, tarY, PLAYER);
    }
    // this.storeMove(this.level);

    // pushing crate
} else if (result === CRATE || result === CRATE + SPOT) {
    const crateTarY = tarY + dy;
    const crateTarX = tarX + dx;
    const crateResult = this.level.getCell(crateTarX, crateTarY);
    // FIXME: check for Player moving CRATE+SPOT onto another CRATE+SPOT
    if (crateResult === EMPTY || crateResult === SPOT || crateResult === CRATE + SPOT) {
        for (let crate of this.crates) {
            if (crate.gridX === tarX && crate.gridY === tarY) {
                if (this.level.getCell(this.player.gridX, this.player.gridY) === PLAYER + SPOT) {
                    this.level.setCell(this.player.gridX, this.player.gridY, SPOT);
                } else {
                    this.level.setCell(this.player.gridX, this.player.gridY, EMPTY);
                }
                this.player.move(tarX, tarY, MOVE_TIME, 0, anim);

                if (result === CRATE + SPOT) {
                    this.level.setCell(tarX, tarY, PLAYER + SPOT);
                } else {
                    this.level.setCell(tarX, tarY, PLAYER);
                }
                this.level.setCell(crateTarX, crateTarY, CRATE);
                crate.move(crateTarX, crateTarY, MOVE_TIME, 0);
                if (crateResult === SPOT) {
                    this.level.setCell(crateTarX, crateTarY, CRATE + SPOT);

                    if (this.level.checkWin() === 0) {
                        this.gameWin();
                    }
                }
                // this.storeMove(this.level);
            }
        }
    }
}*/

/*
addSprite (gridX, gridY, spriteName, spriteIndex) {
    let s = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, spriteName, spriteIndex);
    s.scale.x = 0.1;
    s.scale.y = 0.1;
    this.game.add.tween(s).to({x: gridX * ICON_SIZE, y: gridY * ICON_SIZE}, FLY_TIME, null, true, Math.random() * DELAY, 0, false);
    this.game.add.tween(s.scale).to({x: 1, y: 1}, FLY_TIME, null, true, Math.random() * DELAY, 0, false);
}*/
/*

storeMove (level) {
    var tempBoard = new Board();
    tempBoard.setData(level.board.getData());
    this.undo.push(tempBoard.data.toString());
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


}*/
