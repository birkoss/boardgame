function Reel(game) {
    Phaser.Group.call(this, game);

    this.reel = this.game.add.tileSprite(0, 0, 48, 48, 'reel', 2);
    this.reel.speed = 5;
    this.addChild(this.reel);

    let button = this.create(0, 0, "blank");
    button.y = this.reel.height + 10;
    button.tint = 0xff00ff;
    button.width = button.height = 48;
    button.inputEnabled = true;
    button.events.onInputUp.add(this.buttonPickClicked, this);
    this.addChild(button);

    this.onValueChanged = new Phaser.Signal();
};

Reel.prototype = Object.create(Phaser.Group.prototype);
Reel.prototype.constructor = Reel;

Reel.prototype.update = function() {
    if (this.reel && this.reel.speed > 0) {
        this.reel.tilePosition.y -= this.reel.speed;
    }
}

Reel.prototype.buttonPickClicked = function() {
     if (this.reel.speed > 0) {
        let tween = this.game.add.tween(this.reel).to({speed:0}, 1500, Phaser.Easing.Circular.In);
        tween.onComplete.add(function() {
            /* Stop the reel on the NEXT correct value */
            let next = Math.round(Math.abs(this.reel.tilePosition.y) / 48.0) * 48;

            let tween = this.game.add.tween(this.reel.tilePosition).to({y:(next*-1)}, 500, Phaser.Easing.Elastic.InOut);
            tween.onComplete.add(function() {
                this.value = ((next / 48) % 6) + 1;
                console.log("Value picked: " + this.value);
                this.onValueChanged.dispatch(this, this.value);
            }, this);
            tween.start();

        }, this);
        tween.start();
    }
}