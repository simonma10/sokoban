import GameState from './states/GameState'
import HomeState from './states/HomeState'
import WinState from './states/WinState'

class Game extends Phaser.Game {
    constructor () {
        super(1024, 768, Phaser.AUTO);
        this.state.add('GameState', GameState);
        this.state.add('HomeState', HomeState);
        this.state.add('WinState', WinState);
        this.state.start('HomeState');
    }
}

new Game ()
