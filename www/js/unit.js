function Unit(game, unitID) {
    Phaser.Group.call(this, game);

    this.unitID = unitID;
    this.data = GAME.json['units'][unitID];

    this.setHealth(10);

    this.init();
};

Unit.prototype = Object.create(Phaser.Group.prototype);
Unit.prototype.constructor = Unit;

Unit.Facing = {
    Left: 1,
    Right: -1
};

Unit.prototype.face = function(direction) {
    this.sprite.scale.x = direction;
};

Unit.prototype.init = function() {
    this.sprite = this.create(0, 0, 'tileset:units');
    this.sprite.anchor.set(0.5, 0.5);

    this.sprite.animations.add('idle', this.data.frames, 2, true);
    this.sprite.animations.play('idle');
};

Unit.prototype.isAlive = function() {
    return this.health > 0;
};

Unit.prototype.setHealth = function(newHealth) {
    this.health = newHealth;
    this.takeDamage(0);
};

Unit.prototype.takeDamage = function(damage) {
    this.health = Math.max(this.health - damage, 0);

    if (!this.isAlive()) {
        this.sprite.destroy();

        this.sprite = this.create(0, 0, 'tileset:effectsSmall');
        this.sprite.frame = this.game.rnd.integerInRange(94, 99);
        this.sprite.anchor.set(0.5, 0.5);
    }
};