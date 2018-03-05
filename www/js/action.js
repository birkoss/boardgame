function Action(game, x, y, effect) {
    this.effect = effect;

    let frame = 0;
    let spriteSheet = "tileset:effectsLarge"
    switch (this.effect) {
        case "attack":
            spriteSheet = "tileset:effectsLarge";
            frame = 18;
            break;
    }

    console.log(effect, spriteSheet);

    Phaser.Sprite.call(this, game, x, y, spriteSheet);
    this.anchor.set(0.5, 0.5);

    this.frame = frame;

    this.x += (24);
    this.y += (24);

    this.game.add.tween(this.scale).to({x:0.6, y:0.6}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true); 
};

Action.prototype = Object.create(Phaser.Sprite.prototype);
Action.prototype.constructor = Action;