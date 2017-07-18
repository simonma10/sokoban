import Phaser from 'phaser-ce';

import HomeState from './states/HomeState';
import WinState from './states/WinState';
import MainGameState from './states/MainGameState';

class Game extends Phaser.Game {
    constructor () {
        super(1024, 768, Phaser.AUTO);

        this.state.add('HomeState', HomeState);
        this.state.add('WinState', WinState);
        this.state.add('MainGameState', MainGameState);
        this.state.start('HomeState');
    }
}

new Game()
