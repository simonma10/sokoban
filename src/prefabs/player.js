import { ICON_SIZE, debug } from '../constants';
/**
 * Player prefab
 * @param game
 * @param x
 * @param y
 * @param key
 * @constructor
 */
class Player extends Phaser.Sprite {
    constructor(game, x, y, key, gridX, gridY) {
        super(x, y, key)
        //Phaser.Sprite.call(this, game, x, y, key);
        this.gridX = gridX;
        this.gridY = gridY;
        if (debug) {
            console.log("Player: " + this.gridX + ", " + this.gridY)
        }
        this.game = game;
        this.sprite = this.game.add.sprite(x, y, 'player');
        this.moveCounter = 0;

        this.sprite.animations.add("left", [9, 7, 8, 7], 20, false);
        this.sprite.animations.add('right', [6, 4, 5, 4], 20, false);
        this.sprite.animations.add('down', [11, 10, 0, 10], 20, false);
        this.sprite.animations.add('up', [3, 1, 2, 1], 20, false);

        this.sprite.anchor.setTo(0);
    }


    move (gridX, gridY, anim) {
        this.gridX = gridX;
        this.gridY = gridY;

        this.isMoving = true;

        var playerMove = this.game.add.tween(this.sprite);
        playerMove.to({x: gridX * ICON_SIZE, y: gridY * ICON_SIZE}, 200);
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