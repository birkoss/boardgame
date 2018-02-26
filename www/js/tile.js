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
    this.tile = this.create(0, 0, 'blank');
    this.tile.anchor.set(0.5, 0.5);
    this.tile.width = this.tile.height = 48;
    this.type = "";
};

Tile.prototype.setType = function(newType) {
    this.type = newType;

    switch (this.type) {
        case 'enemy':
            switch (this.weapon) {
                case 'sword':
                    this.tile.tint = 0xff0000;
                    break;
                case 'bow':
                    this.tile.tint = 0x00ff00;
                    break;
                case 'axe':
                    this.tile.tint = 0x0000ff;
                    break;
                case 'rod':
                    this.tile.tint = 0xff00ff;
                    break;
            }
            break;
        case 'start':
            this.tile.tint = 0xf4f4f4;
            break;
        case 'disabled':
            this.tile.tint = 0xcccccc;
            break;
        case 'key':
            this.tile.tint = 0xffffcc;
            break;
        case 'chest':
            this.tile.tint = 0xffff33;
            break;
    }
};

Tile.prototype.setWeapon = function(newWeapon) {
    this.weapon = newWeapon;

    this.unit = this.create(0, 0, 'blank');
    this.unit.anchor.set(0.5, 0.5);
    this.unit.width = this.unit.height = 32;
    this.unit.x = this.unit.y = 0;
    this.unit.tint = 0x000000;

};

Tile.prototype.enableClick = function() {
    this.tile.inputEnabled = true;
    this.tile.events.onInputUp.add(this.onTileClicked, this);
};

Tile.prototype.onTileClicked = function() {
    this.onClicked.dispatch(this);
};