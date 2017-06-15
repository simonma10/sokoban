var Sokoban = Sokoban || {};

/*var sgs = require('./states/GameState');
var shs = require('./states/HomeState');
var sws = require('./states/WinState');*/
//var sls = require('./states/LoadState');


Sokoban.game = new Phaser.Game(1024,768 , Phaser.AUTO);

Sokoban.game.state.add('GameState', Sokoban.GameState);
Sokoban.game.state.add('HomeState', Sokoban.HomeState);
Sokoban.game.state.add('WinState', Sokoban.WinState);

//Sokoban.game.state.add('LoadState', Sokoban.LoadState);
Sokoban.game.state.start('HomeState');
