function Bar(game, value, max) {
    Phaser.Group.call(this, game);

console.log(value + "x" + max);

    this.max = max;

    this.init();

    this.move(value);
};

Bar.prototype = Object.create(Phaser.Group.prototype);
Bar.prototype.constructor = Bar;

Bar.prototype.init = function() {
    this.background = this.game.make.sprite(0, 0, "blank");
    this.background.anchor.set(0.5, 0.5);
    this.background.tint = 0xffffff;
    this.background.width = 50;
    this.background.height = 4;
    this.addChild(this.background);

    this.content = this.game.make.sprite(0, 0, "blank");
    this.content.x -= (this.background.width/2);
    this.content.y -= (this.background.height/2);
    this.content.tint = 0xff00ff;
    this.content.width = this.background.width;
    this.content.height = this.background.height;
    this.addChild(this.content);
}

Bar.prototype.move = function(value) {
    this.value = value;
    this.content.width = Math.round(this.background.width * this.value / this.max);
};