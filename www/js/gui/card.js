function Card(game) {
    Phaser.Group.call(this, game);

    this.card = this.game.add.tileSprite(0, 0, 48, 48, 'reel', 2);
    this.card.anchor.set(0.5, 0.5);
    this.card.x = (this.card.width/2);
    this.card.y = (this.card.height/2);
    this.card.inputEnabled = true;
    this.card.events.onInputUp.add(this.onCardPicked, this);
    this.addChild(this.card);

    this.value = this.game.rnd.integerInRange(1, 6);

    this.onPicked = new Phaser.Signal();
    this.onFlipped = new Phaser.Signal();
};

Card.prototype = Object.create(Phaser.Group.prototype);
Card.prototype.constructor = Card;

Card.prototype.onCardPicked = function() {
    this.onPicked.dispatch(this);
}

Card.prototype.flip = function() {
    var tween1 = this.game.add.tween(this.card.scale);
    tween1.to({ x: 0 }, 300, Phaser.Easing.Linear.None, false, 0);
    tween1.onComplete.addOnce(function (sprite, tween) {
        this.card.tilePosition.y -= ((this.value-1) * 48);
    }, this);
    var tween2 = this.game.add.tween(this.card.scale);
    tween2.to({ x: 1 }, 300, Phaser.Easing.Linear.None, false, 0);
    tween2.onComplete.addOnce(function() {
        this.onFlipped.dispatch(this, this.value);
    }, this);
    tween1.chain(tween2);
    tween1.start();
};