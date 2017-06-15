var Sokoban = Sokoban || {};

Sokoban.game = new Phaser.Game(1024,768 , Phaser.AUTO);

Sokoban.game.state.add('GameState', Sokoban.GameState);
Sokoban.game.state.add('HomeState', Sokoban.HomeState);
Sokoban.game.state.add('WinState', Sokoban.WinState);
Sokoban.game.state.add('LoadState', Sokoban.LoadState);
Sokoban.game.state.start('HomeState');
