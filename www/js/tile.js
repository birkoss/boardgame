function Tile(game, x, y) {
    Phaser.Group.call(this, game);

    this.init();

    this.x = x * this.width;
    this.y = y * this.height;

    this.onClicked = new Phaser.Signal();
};

Tile.prototype = Object.create(Phaser.Group.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.init = function() {
    this.tile = this.create(0, 0, 'blank');
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
};

Tile.prototype.enableClick = function() {
    this.tile.inputEnabled = true;
    this.tile.events.onInputUp.add(this.onTileClicked, this);
};

Tile.prototype.onTileClicked = function() {
    this.onClicked.dispatch(this);
};