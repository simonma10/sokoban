
class HomeState extends Phaser.State {
    constructor () {
        super ()
    }
    init () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }

    preload () {
        this.game.load.image('knightHawks', '../static/fonts/KNIGHT3.png');
    }

    create () {
        //TODO: Select and implement title screen with retro font
        const font = this.game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
        const i = this.game.add.image(this.game.world.centerX, 6 + 3 * 32, font);
        //i.tint = Math.random() * 0xFFFFFF;
        i.tint = 0xDD0000;
        i.anchor.set(0.5, 1);
        font.text = "SOKOBAN";

        const titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 200,
            "Sokoban", {font: "bold 64pt Arial", fill:"#FFFFFF"});
        titleText.anchor.setTo(0.5);

        const instrText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 200,
            "Cursor keys to move\nZ - undo, X - restart level\nAny key to Start", {font: "bold 32pt Arial", fill:"#FF2200"});
        instrText.anchor.setTo(0.5);

        const k = this.game.input.keyboard.onDownCallback = function(){
            this.game.input.keyboard.onDownCallback = null;
            this.game.state.start('GameState', true, false)};
    }
}

export default HomeState;
