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
        this.game.load.image('keyDown', '../static/images/keys/Keyboard_White_Arrow_Down.png');
        this.game.load.image('keyUp', '../static/images/keys/Keyboard_White_Arrow_Up.png');
        this.game.load.image('keyLeft', '../static/images/keys/Keyboard_White_Arrow_Left.png');
        this.game.load.image('keyRight', '../static/images/keys/Keyboard_White_Arrow_Right.png');
        this.game.load.image('keyZ', '../static/images/keys/Keyboard_White_Z.png');
        this.game.load.image('keyX', '../static/images/keys/Keyboard_White_X.png');

        this.load.spritesheet('player', '../static/images/player.png', ICON_SIZE, ICON_SIZE, 12);
        this.load.spritesheet('crate', '../static/images/crate.png', ICON_SIZE, ICON_SIZE, 4);

        this.game.load.image('title', '../static/images/title4.png');

    }

    create () {
        this.game.stage.backgroundColor = '#606060';

        const titleImage = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 100, 'title');
        titleImage.anchor.setTo(0.5);

        this.grp1 = this.game.add.group();
        this.grp1.create(-150, 320, 'crate', 1);
        this.grp1.create(-200, 320, 'player', 4);

        this.grp2 = this.game.add.group();
        this.grp2.create(1200, 160, 'player', 7);
        this.grp2.create(1150, 160, 'crate', 2);

        this.tw1 = this.game.add.tween(this.grp1).to({x: 1400}, 3000, null, false, 500, 0, false);
        this.tw2 = this.game.add.tween(this.grp2).to({x: -1400}, 3000, null, false, 500, 0, false);
        this.tw1.onComplete.add(() => {
            let timer = this.game.time.create(false);
            timer.loop(6000, this.timerCallback, this);
            timer.start();
        });
        this.tw1.chain(this.tw2);
        this.animate();

        let style = { font: 'bold 24pt Arial', fill: '#FFFFFF'};
        let kY = this.game.world.centerY + 180;
        let kX = this.game.world.centerX - 200;
        let keys = this.game.add.group();
        keys.create(kX, kY, 'keyLeft');
        keys.create(kX + 80, kY, 'keyRight');
        keys.create(kX + 160, kY, 'keyUp');
        keys.create(kX + 240, kY, 'keyDown')
        const textCursors = this.game.add.text(kX + 350, kY + 30, 'move', style);

        this.game.add.sprite(kX - 100, kY + 80, 'keyX');
        this.game.add.text(kX, kY + 110, 'restart level', style );
        this.game.add.sprite(kX + 200, kY + 80, 'keyZ');
        this.game.add.text(kX + 300, kY + 110, 'undo move', style );

        let anyKey = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press any key to start', style);
        anyKey.anchor.setTo(0.5);
        this.game.add.tween(anyKey).to({alpha: 0}, 400, Phaser.Easing.Cubic.InOut, true, 0, 1000, true);

        this.game.input.keyboard.onDownCallback = () => {
            this.game.input.keyboard.onDownCallback = null;
            this.game.state.start('MainGameState', true, false)
        }
    }

    animate () {
       this.tw1.start();
    }

    timerCallback () {
        this.grp1.x = -100;
        this.grp2.x = 1100;
        this.animate();
    }
}

export default HomeState;
