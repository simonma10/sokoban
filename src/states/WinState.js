/**
 * Created by Simon on 3/06/2017.
 */
var Sokoban = Sokoban || {};

Sokoban.WinState = {
    init: function(){

    },

    create: function(){
        var titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 200,
            "You Win!!", {font: "bold 64pt Arial", fill:"#FFFFFF"});
        titleText.anchor.setTo(0.5);

        var k = this.game.input.keyboard.onDownCallback = function(){
            this.game.input.keyboard.onDownCallback = null;
            this.game.state.start('HomeState', true, false)};
    }
}