function Unit(game, unitID) {
    Phaser.Group.call(this, game);

    this.unitID = unitID;
    this.data = GAME.json['units'][unitID];

    this.setHealth(10);

    this.onMoved = new Phaser.Signal();

    this.init();
};

Unit.prototype = Object.create(Phaser.Group.prototype);
Unit.prototype.constructor = Unit;

Unit.Facing = {
    Left: 1,
    Right: -1
};

Unit.prototype.face = function(direction) {
    if (this.sprite.scale.x != direction) {
        this.sprite.scale.x = direction;
    }
};

Unit.prototype.init = function() {
    this.sprite = this.create(0, 0, 'tileset:units');
    this.sprite.anchor.set(0.5, 0.5);
    //this.sprite.x += (this.sprite.width/2);
    //this.sprite.y += (this.sprite.height/2);

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

Unit.prototype.placeTo = function(x, y) {
    this.grid = new Phaser.Point(x, y);

    this.x = (x * this.width) + (this.width/2);
    this.y = (y * this.height) + (this.height/2);
};

Unit.prototype.moveTo = function(x, y) {
    /* Face to the right direction */
    if (this.grid.x > x) {
       this.face(Unit.Facing.Left);
    } else if (this.grid.x < x) {
        this.face(Unit.Facing.Right);
    }

    this.grid = new Phaser.Point(x, y);

    let nx = (x * this.width) + (this.width/2);
    let ny = (y * this.height) + (this.height/2);

    let tween = this.game.add.tween(this).to({x:nx, y:ny}, 200, Phaser.Easing.Elastic.Out);
    tween.onComplete.add(function() {
        this.onMoved.dispatch(this);
    }, this);
    tween.start();
};