import Phaser from 'phaser-ce';

class WinState extends Phaser.State {
    create () {
        let titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 200,
            'You Win!!', {font: 'bold 64pt Arial', fill: '#FFFFFF'});
        titleText.anchor.setTo(0.5);

        this.game.input.keyboard.onDownCallback = () => {
            this.game.input.keyboard.onDownCallback = null;
            this.game.state.start('HomeState', true, false)
        }
    }
}

export default WinState;
