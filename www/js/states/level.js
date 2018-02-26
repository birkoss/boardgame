var GAME = GAME || {};

GAME.Level = function() {};

/* Phaser */

GAME.Level.prototype.create = function() {
    this.game.stage.backgroundColor = 0x262626;

    this.createMap();

    this.createWeaponPopup();

    this.createPlayer();
};

GAME.Level.prototype.createMap = function() {
    this.mapContainer = this.game.add.group();
    this.map = new Map(this.game);
    this.map.onTileRevealed.add(this.onMapTileRevealed, this);
    this.mapContainer.addChild(this.map);

    this.map.reveal(2, 4);

    this.mapContainer.x = (this.game.width - this.mapContainer.width) / 2;
    this.mapContainer.y = (this.game.height - this.mapContainer.height) / 2;
};

GAME.Level.prototype.createPlayer = function() {   
    this.player = this.map.create(0, 0, 'blank');
    this.player.anchor.set(0.5, 0.5);
    this.player.grid = new Phaser.Point(2, 5);
    this.player.width = this.player.height = 48;
    this.player.x = 2 * this.player.width;
    this.player.y = 5 * this.player.height;
    this.player.tint = 0xff00ff;
    this.player.alpha = 0;

};

GAME.Level.prototype.createWeaponPopup = function() {
    this.currentWeapon = "";

    let popup = new PopupWeapon(this.game);
    popup.onWeaponChoosen.add(this.onWeaponPopupChanged, this);
    popup.selectWeapon("sword");
    popup.show();
};

GAME.Level.prototype.onWeaponPopupChanged = function(newWeapon) {
    this.currentWeapon = newWeapon;
    console.log("Current Weapon: " + newWeapon);
};

GAME.Level.prototype.move = function(tile) {
    let tween = this.game.add.tween(this.player).to({x:tile.x, y:tile.y}, 400);
    tween.onComplete.add(function() {
        this.enableClick(tile.grid.x, tile.grid.y);
        this.player.grid = new Phaser.Point(tile.grid.x, tile.grid.y);
    }, this);
    tween.start();
};

GAME.Level.prototype.onMapTileRevealed = function(tile) {
    switch(tile.type) {
        case 'disabled':
            this.enableClick(this.player.grid.x, this.player.grid.y);
            break;
        case 'enemy':
            if (this.currentWeapon == tile.weapon) {
                this.attack(tile);
            } else {
                this.defend(tile);
            }
            break;
        case 'key':
        case 'chest':
            this.move(tile);
            break;
        default:
            if (this.player.alpha == 0) {
                this.game.add.tween(this.player).to({alpha: 1}, 300).start();
            }
            this.move(tile);
    }
};

GAME.Level.prototype.attack = function(tile) {
    //this.map.reveal(tile.grid.x, tile.grid.y);
    this.move(tile);
};

GAME.Level.prototype.defend = function(tile) {
    this.map.map.children.forEach(function(single_tile) {
        if (single_tile.type == 'start') {
            console.log("GAME OVER");
            this.player.x = single_tile.x;
            this.player.y = single_tile.y + single_tile.height;
            this.player.grid.x = single_tile.grid.x;
            this.player.grid.y = single_tile.grid.y;

            this.map.reset();
            this.map.reveal(single_tile.grid.x, single_tile.grid.y);
        }
    }, this);
};

GAME.Level.prototype.enableClick = function(x, y) {
    let clickableTiles = this.map.clickable(x, y);
    if (clickableTiles == 0) {
        alert('GAME OVER');
    }
};