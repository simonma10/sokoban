import Phaser from 'phaser-ce';

import { ICON_SIZE } from '../constants';

class HomeState extends Phaser.State {
    init () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }

    preload () {
        this.game.load.image('knightHawks', '../static/fonts/KNIGHT3.png');
        this.load.spritesheet('player', '../static/images/player.png', ICON_SIZE, ICON_SIZE, 12);
        this.load.spritesheet('crate', '../static/images/crate.png', ICON_SIZE, ICON_SIZE, 15);
    }

    create () {
        // TODO: Select and implement title screen with retro font
        const font = this.game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
        const i = this.game.add.image(this.game.world.centerX, 6 + 3 * 32, font);
        // i.tint = Math.random() * 0xFFFFFF;
        i.tint = 0xDD0000;
        i.anchor.set(0.5, 1);
        font.text = 'SOKOBAN';

        const titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 200,
            'Sokoban', {font: 'bold 64pt Arial', fill: '#FFFFFF'});
        titleText.anchor.setTo(0.5);

        this.playerSprite = this.game.add.sprite(-100, 320, 'player', 4);
        this.playerSprite2 = this.game.add.sprite(1100, 400, 'player', 7);
        // this.crateSprite = this.game.add.sprite(0, 0, 'crate', 1);
        this.tw1 = this.game.add.tween(this.playerSprite).to({x: 1100}, 3000, null, false, 500, 0, false);
        this.tw2 = this.game.add.tween(this.playerSprite2).to({x: -100}, 3000, null, false, 500, 0, false);
        this.tw1.onComplete.add(() => {
            let timer = this.game.time.create(false);
            timer.loop(5000, this.timerCallback, this);
            timer.start();
        });
        this.tw1.chain(this.tw2);
        this.animate(this.playerSprite, this.playerSprite2);

        const instrText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 200,
            'Cursor keys to move\nZ - undo, X - restart level\nAny key to Start', { font: 'bold 24pt Arial', fill: '#FF2200' });
        instrText.anchor.setTo(0.5);

        this.game.input.keyboard.onDownCallback = () => {
            this.game.input.keyboard.onDownCallback = null;
            this.game.state.start('GameState', true, false)
        }
    }

    animate () {
       this.tw1.start();
    }

    timerCallback () {
        this.playerSprite.x = -100;
        this.playerSprite2.x = 1100;
        this.animate();
    }
}

export default HomeState;
