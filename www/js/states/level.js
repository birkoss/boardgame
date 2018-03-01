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
    this.background = this.game.add.tileSprite(0, 0, Math.ceil(this.game.width/48)*48, Math.ceil(this.game.height/48)*48, 'tileset:world', 208);

    this.background.x = (this.game.width - this.background.width) / 2;
    //this.background.y = (this.game.height - this.background.height) / 2;


    /*
    this.background.anchor.set(0.5, 0.5);
    this.background.x = (this.game.width / 2);
    this.background.y = (this.game.height / 2);
    */

    this.mapContainer = this.game.add.group();
    this.map = new Map(this.game);
    this.map.onTileRevealed.add(this.onMapTileRevealed, this);
    this.mapContainer.addChild(this.map);

    this.map.reveal(3, 6);

    this.mapContainer.x = Math.round((this.game.width - this.mapContainer.width) / 2);
    this.mapContainer.y = Math.ceil(Math.round((this.game.height - this.mapContainer.height) / 2) / 48) * 48;

//this.background.x = -20;

    console.log(this.mapContainer.x + "x" + this.mapContainer.y + " | " + this.background.x + "x" + this.background.y);

    console.log(this.background.width + "x" + this.background.height);
};

GAME.Level.prototype.createPlayer = function() {
    this.player = new Unit(this.game, 'knight');
    this.player.health = GAME.player.health;
    this.player.grid = new Phaser.Point(3, 6);
    this.player.x = (this.player.grid.x * this.player.width) + this.player.width/2;
    this.player.y = (this.player.grid.y * this.player.height) + this.player.height/2;

    this.mapContainer.addChild(this.player);
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
    if (this.player.x < tile.x) {
        this.player.face(Unit.Facing.Right);
    } else if (this.player.x > tile.x) {
        this.player.face(Unit.Facing.Left);
    }

    let tween = this.game.add.tween(this.player).to({x:tile.x, y:tile.y}, 200);
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
            if (this.player.x < tile.x) {
                this.player.face(Unit.Facing.Right);
            } else if (this.player.x > tile.x) {
                this.player.face(Unit.Facing.Left);
            }

            let popup = new PopupBattle(this.game);
            popup.setTile(tile);
            popup.onBattleCompleted.add(this.onPopupBattleCompleted, this);
            popup.show();
            break;
        case 'key':
        case 'chest':
            this.move(tile);
            break;
        case 'start':
            this.enableClick(tile.grid.x, tile.grid.y);
            break;
        default:
            if (this.player.alpha == 0) {
                this.game.add.tween(this.player).to({alpha: 1}, 300).start();
            }
            this.move(tile);
    }
};

GAME.Level.prototype.enableClick = function(x, y) {
    let clickableTiles = this.map.clickable(x, y);
    if (clickableTiles == 0) {
        alert('GAME OVER');
    }
};

GAME.Level.prototype.onPopupBattleCompleted = function(hasWin, data) {
    this.player.setHealth(GAME.player.health);

    if (hasWin) {
        data.tile.unit.setHealth(data.enemy.health);
        this.move(data.tile);
    }
};