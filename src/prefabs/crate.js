import Phaser from 'phaser-ce';

import { ICON_SIZE, FLY_TIME, DELAY } from '../constants';

class Crate extends Phaser.Sprite {
    constructor (game, gridX, gridY, key) {
        super(gridX * ICON_SIZE, gridY * ICON_SIZE, key);

        this.game = game;
        this.gridX = gridX;
        this.gridY = gridY;
        this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'crate');
        this.move(gridX, gridY, FLY_TIME, DELAY);
        this.sprite.anchor.setTo(0);
    }

    move (gridX, gridY, time, delay) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.isMoving = true;
        const crateMove = this.game.add.tween(this.sprite);
        crateMove.to({x: gridX * ICON_SIZE, y: gridY * ICON_SIZE}, time, null, false, delay, 0, false);
        crateMove.onComplete.add(() => {
            this.isMoving = false;
        }, this);
        crateMove.start();
    }

    explode () {
        let offset = ICON_SIZE / 2;
        let emitter = this.game.add.emitter((this.gridX * ICON_SIZE) + offset, (this.gridY * ICON_SIZE) + offset, 500);
        emitter.makeParticles('redParticle');
        emitter.minParticleSpeed.setTo(-200, -200);
        emitter.maxParticleSpeed.setTo(200, 200);
        emitter.gravity = 0;
        emitter.start(true, 500, null, 500);
    }

    setGridX (dx) {
        this.gridX += dx;
    }

    setGridY (dy) {
        this.gridY += dy;
    }
}

export default Crate;
