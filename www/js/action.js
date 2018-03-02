function Action(game, x, y, type) {
    let spriteSheet = "tileset:effectsLarge"
    switch (type) {
        case "attack":
            spriteSheet = "tileset:effectsLarge";
            break;
    }

    Phaser.Sprite.call(this, game, x, y, spriteSheet);
    this.anchor.set(0.5, 0.5);

    this.x += (24);
    this.y += (24);

    this.game.add.tween(this.scale).to({x:0.6, y:0.6}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true); 
};

Action.prototype = Object.create(Phaser.Sprite.prototype);
Action.prototype.constructor = Action;