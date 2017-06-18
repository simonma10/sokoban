import Phaser from 'phaser-ce';

import { ICON_SIZE, FLY_TIME, DELAY, debug } from '../constants';

class Player extends Phaser.Sprite {
    constructor (game, x, y, key, gridX, gridY) {
        super(x, y, key)
        this.gridX = gridX;
        this.gridY = gridY;
        if (debug) {
            console.log('Player: ' + this.gridX + ', ' + this.gridY)
        }
        this.game = game;
        this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
        this.move(gridX, gridY, FLY_TIME, DELAY, 'down');
        this.moveCounter = 0;

        this.sprite.animations.add('left', [9, 7, 8, 7], 20, false);
        this.sprite.animations.add('right', [6, 4, 5, 4], 20, false);
        this.sprite.animations.add('down', [11, 10, 0, 10], 20, false);
        this.sprite.animations.add('up', [3, 1, 2, 1], 20, false);
        this.sprite.anchor.setTo(0);
    }

    move (gridX, gridY, time, delay, anim) {
        this.gridX = gridX;
        this.gridY = gridY;

        this.isMoving = true;

        let playerMove = this.game.add.tween(this.sprite);
        playerMove.to({x: gridX * ICON_SIZE, y: gridY * ICON_SIZE}, time, null, false, delay, 0, false);
        playerMove.onComplete.add(function () {
            this.moveCounter += 1;
            this.isMoving = false;
        }, this);

        this.sprite.animations.play(anim);
        playerMove.start();
        this.isMoving = false;
    }

    getMoveCount () {
        return this.moveCounter;
    }
}

export default Player;
