/**
 * Created by Simon on 27/05/2017.
 */
var Sokoban = Sokoban || {};

/**
 * Crate prefab
 * @param game
 * @param x
 * @param y
 * @param key
 * @constructor
 */
Sokoban.Crate = function(game, gridX, gridY, key) {

    Phaser.Sprite.call(this, game, gridX * ICON_SIZE, gridY * ICON_SIZE, key);

    this.game = game;
    this.gridX = gridX;
    this.gridY = gridY;
    this.sprite = this.game.add.sprite(this.gridX * ICON_SIZE,this.gridY * ICON_SIZE,'crate');
    //this.setGridX(gridX);
    //this.setGridY(gridY);
    this.sprite.anchor.setTo(0);
    this.isParked = false;
}

Sokoban.Crate.prototype = Object.create(Phaser.Sprite.prototype);
Sokoban.Crate.prototype.constructor = Sokoban.Crate;

Sokoban.Crate.prototype.move = function(gridX, gridY){
    this.gridX = gridX;
    this.gridY = gridY;

    this.isMoving = true;

    var crateMove = this.game.add.tween(this.sprite);
    crateMove.to({x: gridX * ICON_SIZE, y: gridY * ICON_SIZE}, 200);
    crateMove.onComplete.add(function() {
        this.isMoving = false;
    }, this);

    //this.sprite.animations.play(anim);

    crateMove.start();
}


Sokoban.Crate.prototype.explode = function(){
    var offset = ICON_SIZE/2;

    var emitter = this.game.add.emitter((this.gridX * ICON_SIZE) + offset, (this.gridY * ICON_SIZE) + offset, 500);
    emitter.makeParticles('redParticle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200,200);
    emitter.gravity = 0;
    emitter.start(true, 500, null, 500);
}


Sokoban.Crate.prototype.setGridX = function(dx){
    this.gridX += dx;
}

Sokoban.Crate.prototype.setGridY = function(dy){
    this.gridY += dy;
}