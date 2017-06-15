/**
 * Created by Simon on 28/05/2017.
 */
var Sokoban = Sokoban || {};
var font;

Sokoban.HomeState = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },

    preload: function () {
        this.game.load.image('knightHawks', '../../assets/fonts/KNIGHT3.png');
    },

    create: function () {
        //TODO: Select and implement title screen with retro font
        font = this.game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
        var i = this.game.add.image(this.game.world.centerX, 6 + 3 * 32, font);
        //i.tint = Math.random() * 0xFFFFFF;
        i.tint = 0xDD0000;
        i.anchor.set(0.5, 1);

        font.text = "SOKOBAN";
        /*for (var c = 1; c < 19; c++)
        {
            var i = this.game.add.image(this.game.world.centerX, 6 + c * 32, font);
            i.tint = Math.random() * 0xFFFFFF;
            i.anchor.set(0.5, 1);
        }*/

        var titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 200,
            "Sokoban", {font: "bold 64pt Arial", fill:"#FFFFFF"});
        titleText.anchor.setTo(0.5);

        var instrText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 200,
            "Cursor keys to move\nZ - undo, X - restart level\nAny key to Start", {font: "bold 32pt Arial", fill:"#FF2200"});
        instrText.anchor.setTo(0.5);

        var k = this.game.input.keyboard.onDownCallback = function(){
            this.game.input.keyboard.onDownCallback = null;
            this.game.state.start('GameState', true, false)};
    },

    update: function(){



        /*if(this.game.input.activePointer.isDown || this.game.input.keyboard.onDown){
            this.game.state.start('GameState', true, false);
        }*/
    }

}