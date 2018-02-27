function Unit(game) {
    Phaser.Group.call(this, game);

    this.health = this.max_health = 10; 

    this.init();
};

Unit.prototype = Object.create(Phaser.Group.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.init = function() {
    this.tile = this.create(0, 0, 'blank');
    this.tile.anchor.set(0.5, 0.5);
    this.tile.tint = 0xff0000;
    this.tile.width = this.tile.height = 48;
};

Unit.prototype.isAlive = function() {
    return this.health > 0;
};

Unit.prototype.takeDamage = function(damage) {
    this.health = Math.max(this.health - damage, 0);

    if (!this.isAlive()) {
        this.tile.alpha = 0.5;
    }
};