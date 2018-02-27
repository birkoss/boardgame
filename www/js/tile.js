function Tile(game, x, y) {
    Phaser.Group.call(this, game);

    this.init();

    this.grid = new Phaser.Point(x, y);
    this.x = (x * this.width) + (this.width/2);
    this.y = (y * this.height) + (this.height/2);

    this.onClicked = new Phaser.Signal();


};

Tile.prototype = Object.create(Phaser.Group.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.init = function() {
    this.tile = this.create(0, 0, 'tileset:world');
    this.tile.anchor.set(0.5, 0.5);

    this.tile.frame = 688;
    this.type = "";
};

Tile.prototype.setType = function(newType) {
    this.type = newType;

    switch (this.type) {
        case 'enemy':
            this.unit = new Unit(this.game, 'rat');
            this.addChild(this.unit);
            break;
        case 'start':
            //this.tile.tint = 0xf4f4f4;
            break;
        case 'disabled':
            this.item = this.create(0, 0, 'tileset:world');
            this.item.anchor.set(0.5, 0.5);

            this.item.frame = 288;
            break;
        case 'key':
            this.item = this.create(0, 0, 'tileset:items');
            this.item.anchor.set(0.5, 0.5);

            this.item.frame = 137;
            break;
        case 'chest':
            this.item = this.create(0, 0, 'tileset:world');
            this.item.anchor.set(0.5, 0.5);

            this.item.frame = 258;
            break;
    }
};

Tile.prototype.setWeapon = function(newWeapon) {
    this.weapon = newWeapon;
};

Tile.prototype.enableClick = function() {
    this.tile.inputEnabled = true;
    this.tile.events.onInputUp.add(this.onTileClicked, this);
};

Tile.prototype.onTileClicked = function() {
    this.onClicked.dispatch(this);
};