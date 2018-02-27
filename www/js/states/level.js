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
    this.player.grid = new Phaser.Point(2, 4);
    this.player.width = this.player.height = 48;
    this.player.x = (this.player.grid.x * this.player.width) + this.player.width/2;
    this.player.y = (this.player.grid.y * this.player.height) + this.player.height/2;
    this.player.tint = 0xff00ff;
    //this.player.alpha = 0;

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
            let popup = new PopupBattle(this.game);
            popup.setPlayer(this.player);
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

GAME.Level.prototype.attack = function(tile) {
    let originalPos = new Phaser.Point(this.player.x, this.player.y);

    let tween = this.game.add.tween(this.player).to({x:tile.x, y:tile.y}, 300);
    tween.onComplete.add(function() {
        this.move(tile);
    }, this);
    tween.start();
};

GAME.Level.prototype.defend = function(tile) {
    console.log(tile.unit.x + "x" + tile.unit.y + " VS " + this.player.x + "x" + this.player.y);

    let unit = this.map.create(0, 0, 'blank');
    unit.anchor.set(0.5, 0.5);
    unit.height = unit.width = 32;
    unit.tint = 0xff0000;
    unit.x = tile.x;
    unit.y = tile.y;

    this.map.addChild(unit);

    let tween = this.game.add.tween(unit).to({x:this.player.x, y:this.player.y}, 300);
    tween.onComplete.add(function() {
        let tween = this.game.add.tween(unit).to({x:tile.x, y:tile.y}, 300);
        tween.onComplete.add(function() {
            unit.destroy();



            //this.gameOver();
        }, this);
        tween.start();
    }, this);
    tween.start();
};

GAME.Level.prototype.enableClick = function(x, y) {
    let clickableTiles = this.map.clickable(x, y);
    if (clickableTiles == 0) {
        alert('GAME OVER');
    }
};

GAME.Level.prototype.gameOver = function() {
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

GAME.Level.prototype.onPopupBattleCompleted = function(hasWin, tile) {
    console.log(hasWin, tile);
    if (hasWin) {
        this.move(tile);
    }
};